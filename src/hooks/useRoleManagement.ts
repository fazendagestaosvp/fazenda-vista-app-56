
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserRoleType = "ADM" | "EDITOR" | "VISUALIZADOR";

export interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRoleType;
}

export interface ContaData {
  id: string;
  nome_conta: string;
  proprietario_id: string | null;
}

export const useRoleManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar todos os usuários com seus roles
  const fetchUsersWithRoles = async (): Promise<UserWithRole[]> => {
    try {
      setLoading(true);
      
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) throw profilesError;

      // Buscar emails dos usuários
      const userIds = profiles.map(profile => profile.id);
      const { data: userEmails, error: emailsError } = await supabase.rpc(
        'get_user_emails',
        { user_ids: userIds }
      );

      if (emailsError) throw emailsError;

      // Buscar roles dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role_type');

      if (rolesError) throw rolesError;

      // Combinar dados
      const usersWithRoles: UserWithRole[] = userEmails.map((userEmail: any) => {
        const profile = profiles.find(p => p.id === userEmail.id);
        const roleData = userRoles?.find(r => r.user_id === userEmail.id);
        
        return {
          id: userEmail.id,
          email: userEmail.email,
          full_name: profile?.full_name || null,
          role: (roleData?.role_type || 'EDITOR') as UserRoleType
        };
      });

      return usersWithRoles;
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Atualizar role de um usuário
  const updateUserRole = async (userId: string, newRole: UserRoleType): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Remover role atual
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Mapear para o enum do banco
      let dbRole;
      switch (newRole) {
        case 'ADM':
          dbRole = 'admin';
          break;
        case 'VISUALIZADOR':
          dbRole = 'viewer';
          break;
        default:
          dbRole = 'editor';
      }

      // Inserir novo role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: dbRole,
          role_type: newRole
        });

      if (insertError) throw insertError;

      toast({
        title: "Role atualizado",
        description: `Usuário promovido para ${newRole} com sucesso!`,
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: "Erro ao atualizar role",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar contas disponíveis
  const fetchContas = async (): Promise<ContaData[]> => {
    try {
      const { data, error } = await supabase
        .from('contas')
        .select('id, nome_conta, proprietario_id')
        .order('nome_conta');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erro ao buscar contas:', error);
      toast({
        title: "Erro ao carregar contas",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  // Gerenciar permissões de visualizadores
  const manageVisualizadorPermissions = async (
    visualizadorId: string, 
    contaIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Remover permissões existentes
      const { error: deleteError } = await supabase
        .from('visualizadores_permitidos')
        .delete()
        .eq('visualizador_id', visualizadorId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (contaIds.length > 0) {
        const permissionsData = contaIds.map(contaId => ({
          visualizador_id: visualizadorId,
          conta_id: contaId
        }));

        const { error: insertError } = await supabase
          .from('visualizadores_permitidos')
          .insert(permissionsData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Permissões atualizadas",
        description: "Permissões do visualizador foram atualizadas com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao gerenciar permissões:', error);
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

  // Buscar permissões de um visualizador
  const fetchVisualizadorPermissions = async (visualizadorId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('visualizadores_permitidos')
        .select('conta_id')
        .eq('visualizador_id', visualizadorId);

      if (error) throw error;
      return data.map(item => item.conta_id) || [];
    } catch (error: any) {
      console.error('Erro ao buscar permissões:', error);
      return [];
    }
  };

  return {
    loading,
    fetchUsersWithRoles,
    updateUserRole,
    fetchContas,
    manageVisualizadorPermissions,
    fetchVisualizadorPermissions
  };
};
