
import { supabase } from "@/integrations/supabase/client";

/**
 * Removes a user from the system
 */
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
