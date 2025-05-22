
import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, mapUiRoleToDbRole, mapDbRoleToUiRole } from "@/types/user.types";

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
    console.log("Updating user:", { userId, role, fullName });
    
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
      console.log("Mapped role:", { uiRole: role, dbRole });
      
      // Delete any existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Map roles to what Supabase expects in the database
      // This is crucial for type compatibility with Supabase's expected types
      let dbRoleValue: "admin" | "editor" | "viewer";
      
      if (dbRole === "admin") {
        dbRoleValue = "admin";
      } else if (dbRole === "user") {
        dbRoleValue = "editor"; // 'user' in our logic maps to 'editor' in Supabase
      } else {
        dbRoleValue = "viewer";
      }
      
      // Insert with the correctly typed role value
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: dbRoleValue
        });

      if (insertError) {
        console.error("Error inserting role:", insertError);
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
