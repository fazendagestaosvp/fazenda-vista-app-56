
import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, mapUiRoleToDbRole, mapDbRoleToUiRole } from "@/types/user.types";

export const fetchUsersWithRoles = async (): Promise<{ data: any[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, user:profiles(email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users with roles:', error);
      return { data: null, error };
    }

    // Map DbRole to UiRole for each user
    const mappedData = data.map(item => ({
      ...item,
      role: mapDbRoleToUiRole(item.role as DbRole),
      email: item.user?.email,
    }));

    return { data: mappedData, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching users with roles:', error);
    return { data: null, error: error.message };
  }
};

export const updateUser = async ({
  userId,
  role,
  fullName
}: {
  userId: string;
  role?: UiRole;
  fullName?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update profile if fullName is provided
    if (fullName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId);
        
      if (profileError) {
        throw new Error(profileError.message);
      }
    }
    
    // Update role if provided
    if (role) {
      // Convert UiRole to DbRole for database operations
      const dbRole = mapUiRoleToDbRole(role);
      
      // Delete any existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Insert the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: dbRole });

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

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

        return {
          id: userEmail.id,
          name: userProfile?.full_name || 'Sem nome',
          email: userEmail.email,
          role: uiRole,
          created_at: userRole?.created_at || new Date().toISOString(),
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

export const removeUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, delete the user's roles
    const { error: deleteRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteRolesError) {
      throw new Error(deleteRolesError.message);
    }

    // Then, delete the user profile
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (deleteProfileError) {
      throw new Error(deleteProfileError.message);
    }

    // Then, delete the user from auth
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      throw new Error(deleteUserError.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};
