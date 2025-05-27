
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRoleType = 'ADM' | 'EDITOR' | 'VISUALIZADOR';

export interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  role: UserRoleType;
}

export interface ContaData {
  id: string;
  nome_conta: string;
}

export const useRoleManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsersWithRoles = async (): Promise<UserWithRole[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role
        `);

      if (error) throw error;

      // Get user emails
      const userIds = data?.map(item => item.user_id) || [];
      const { data: emailData } = await supabase.rpc('get_user_emails', { user_ids: userIds });

      // Get profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const users: UserWithRole[] = (data || []).map(item => {
        const emailInfo = emailData?.find(e => e.id === item.user_id);
        const profileInfo = profilesData?.find(p => p.id === item.user_id);
        return {
          id: item.user_id,
          email: emailInfo?.email || 'Email não encontrado',
          full_name: profileInfo?.full_name,
          role: item.role === 'admin' ? 'ADM' : item.role === 'viewer' ? 'VISUALIZADOR' : 'EDITOR'
        };
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRoleType): Promise<boolean> => {
    try {
      setLoading(true);
      
      const dbRole = newRole === 'ADM' ? 'admin' : newRole === 'VISUALIZADOR' ? 'viewer' : 'editor';
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: dbRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Papel atualizado",
        description: `Papel do usuário atualizado para ${newRole} com sucesso.`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar papel",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchContas = async (): Promise<ContaData[]> => {
    try {
      const { data, error } = await supabase
        .from('contas')
        .select('*')
        .order('nome_conta');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contas:', error);
      return [];
    }
  };

  const fetchVisualizadorPermissions = async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('visualizadores_permitidos')
        .select('conta_id')
        .eq('visualizador_id', userId);

      if (error) throw error;
      return data?.map(item => item.conta_id) || [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  };

  const manageVisualizadorPermissions = async (userId: string, contaIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);

      // Remove existing permissions
      await supabase
        .from('visualizadores_permitidos')
        .delete()
        .eq('visualizador_id', userId);

      // Add new permissions
      if (contaIds.length > 0) {
        const permissions = contaIds.map(contaId => ({
          visualizador_id: userId,
          conta_id: contaId
        }));

        const { error } = await supabase
          .from('visualizadores_permitidos')
          .insert(permissions);

        if (error) throw error;
      }

      toast({
        title: "Permissões atualizadas",
        description: "Permissões do visualizador foram atualizadas com sucesso.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUsersWithRoles,
    updateUserRole,
    fetchContas,
    fetchVisualizadorPermissions,
    manageVisualizadorPermissions,
  };
};
