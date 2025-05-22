
import { supabase } from "@/integrations/supabase/client";
import { DbRole, mapDbRoleToUiRole } from "@/types/user.types";

/**
 * Fetches all users with their profiles, emails and roles
 */
export const fetchUsers = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');

    if (profilesError) throw profilesError;
    
    const userIds = profiles.map((profile: any) => profile.id);
    
    const { data: userEmails, error: emailsError } = await supabase.rpc(
      'get_user_emails',
      { user_ids: userIds }
    );
    
    if (emailsError) throw emailsError;

    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error("Erro ao buscar papéis dos usuários:", rolesError);
    }

    if (profiles && userEmails) {
      const usersWithRoles = userEmails.map((userEmail: any) => {
        const userProfile = profiles.find((profile: any) => profile.id === userEmail.id);
        const userRole = userRoles?.find((role: any) => role.user_id === userEmail.id);
        const dbRole = (userRole?.role || 'viewer') as DbRole;
        const uiRole = mapDbRoleToUiRole(dbRole);

        // Use a fixed date format if created_at isn't available
        const createdAt = new Date().toISOString();

        return {
          id: userEmail.id,
          name: userProfile?.full_name || 'Sem nome',
          email: userEmail.email,
          role: uiRole,
          created_at: createdAt,
        };
      });

      return { success: true, data: usersWithRoles };
    }
    
    return { success: false, error: 'Erro ao buscar usuários' };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
};
