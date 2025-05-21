import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, dbToUiRole, uiToDbRole } from "@/types/user.types";
import { ServiceResponse, UpdateUserProps, UserWithProfile } from "./types";
import { updateProfile } from "./profileService";

// Fetch all users for management - modified to use public profiles table
export const fetchUsers = async (): Promise<ServiceResponse<any[]>> => {
  try {
    // First, fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        created_at
      `);
    
    if (profilesError) throw profilesError;
    
    // Then get user emails from auth
    const userIds = profiles.map(profile => profile.id);
    
    // Use the Supabase function to get emails for these users
    const { data: userEmails, error: emailsError } = await supabase.rpc(
      'get_user_emails',
      { user_ids: userIds }
    );
    
    if (emailsError) {
      console.error("Error fetching user emails:", emailsError);
      // Continue without emails if there's an error
    }
    
    // Fetch user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error("Erro ao buscar papéis dos usuários:", rolesError);
    }
    
    // Map users with their roles and emails
    const formattedUsers = profiles.map((profile) => {
      // Find the email for this user
      const userEmailObj = userEmails?.find(u => u.id === profile.id);
      const email = userEmailObj?.email || 'Email não disponível';
      
      // Find the role for this user
      const userRole = userRoles?.find(role => role.user_id === profile.id);
      const dbRole = userRole?.role as DbRole || 'viewer';
      
      return {
        id: profile.id,
        name: profile.full_name || email || 'Usuário sem nome',
        email: email,
        role: dbToUiRole(dbRole),
        created_at: new Date(profile.created_at).toLocaleDateString('pt-BR')
      };
    });
    
    console.log("Usuários encontrados:", formattedUsers.length);
    return { success: true, data: formattedUsers };
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error);
    return { success: false, error: error.message || 'Erro ao buscar usuários' };
  }
};

// Update user information
export const updateUser = async ({ userId, fullName, role }: UpdateUserProps): Promise<ServiceResponse> => {
  try {
    // Convert UI role to DB role if provided
    const dbRole = role ? uiToDbRole(role as UiRole) : undefined;
    
    // Update profile if fullName is provided
    if (fullName) {
      await updateProfile(userId, { full_name: fullName });
    }
    
    // Update role if provided
    if (dbRole) {
      // We need to verify that the dbRole is a valid enum value for user_roles table
      // Validate the role value
      const validRoles = ['admin', 'user', 'viewer'];
      
      if (!validRoles.includes(dbRole)) {
        return { success: false, error: `Invalid role: ${dbRole}` };
      }
      
      // Inserir ou atualizar role diretamente na tabela user_roles
      const { error } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: userId, role: dbRole as any },
          { onConflict: 'user_id' }
        );
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar usuário' };
  }
};

// Remove a user - we'll just mark it as inactive
export const removeUser = async (userId: string): Promise<ServiceResponse> => {
  try {
    // Instead of setting is_active=false which doesn't exist,
    // we can use a different approach:
    // 1. We could add a custom metadata field to the auth.users table
    // 2. We could add is_active to the profiles table (would require a migration)
    // 3. We could have a separate table for inactive users
    // For now, let's just remove their role but keep their profile
    
    // Remove user's role
    const { error: roleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (roleError) throw roleError;
    
    // Update profile to indicate inactivity (we could add a note to full_name)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        full_name: "(Inativo) " + (await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single()).data?.full_name || "" 
      })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao remover usuário' };
  }
};
