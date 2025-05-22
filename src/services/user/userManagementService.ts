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
      role: mapDbRoleToUiRole(item.role),
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
}: {
  userId: string;
  role: UiRole;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convert UiRole to DbRole for database operations
    const dbRole = mapUiRoleToDbRole(role);
    
    // Check if the user already has this role
    const { data: existingRoles, error: fetchError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', dbRole);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // If user already has this role, no need to update
    if (existingRoles && existingRoles.length > 0) {
      return { success: true };
    }

    // First delete any existing roles
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

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, delete the user's roles
    const { error: deleteRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteRolesError) {
      throw new Error(deleteRolesError.message);
    }

    // Then, delete the user from the auth.users table
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
