
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserWithRole, UserRoleType } from "./types";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return {
    loading,
    fetchUsersWithRoles
  };
};
