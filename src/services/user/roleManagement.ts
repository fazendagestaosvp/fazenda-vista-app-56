
import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, mapUiRoleToDbRole, mapDbRoleToUiRole } from "@/types/user.types";

/**
 * Fetches all users with their assigned roles
 */
export const fetchUsersWithRoles = async (): Promise<{ data: any[] | null; error: any }> => {
  try {
    // First fetch the user roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .order('created_at', { ascending: false });

    if (roleError) {
      console.error('Error fetching user roles:', roleError);
      return { data: null, error: roleError };
    }

    // Get user IDs to fetch their profiles and emails
    const userIds = roleData.map(item => item.user_id);
    
    // Fetch user emails
    const { data: emailData, error: emailError } = await supabase.rpc(
      'get_user_emails',
      { user_ids: userIds }
    );
    
    if (emailError) {
      console.error('Error fetching user emails:', emailError);
      return { data: null, error: emailError };
    }

    // Combine role and email data
    const mappedData = roleData.map(roleItem => {
      const userEmail = emailData.find(e => e.id === roleItem.user_id);
      return {
        ...roleItem,
        role: mapDbRoleToUiRole(roleItem.role as DbRole),
        email: userEmail ? userEmail.email : 'Unknown',
      };
    });

    return { data: mappedData, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching users with roles:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Updates a user's role in the database
 */
export const updateUserRole = async (
  userId: string,
  role: UiRole
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Convert UiRole to DbRole for database operations
    const dbRole = mapUiRoleToDbRole(role);
    console.log("Mapped role:", { uiRole: role, dbRole });
    
    // Delete any existing roles
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // Insert the new role with the correct type
    // We need to ensure the role matches exactly what the database expects
    let roleToInsert;
    
    if (dbRole === "admin") {
      roleToInsert = "admin";
    } else if (dbRole === "user") {
      roleToInsert = "user";
    } else {
      roleToInsert = "viewer";
    }

    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: roleToInsert
      });

    if (insertError) {
      console.error("Error inserting role:", insertError);
      throw new Error(insertError.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};
