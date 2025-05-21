
import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, dbToUiRole, uiToDbRole } from "@/types/user.types";
import { ServiceResponse, UpdateUserProps, UserWithProfile } from "./types";
import { getAllUsersWithProfiles, deleteUser } from "./adminService";
import { updateProfile } from "./profileService";
import { updateUserRole } from "./adminService";

// Fetch all users for management
export const fetchUsers = async (): Promise<ServiceResponse<any[]>> => {
  try {
    const usersWithProfiles = await getAllUsersWithProfiles();
    
    const formattedUsers = usersWithProfiles.map(({ user, profile }) => ({
      id: user.id,
      name: profile?.full_name || user.email || 'Usuário sem nome',
      email: user.email,
      role: dbToUiRole(user.app_metadata?.role as DbRole || 'viewer'),
      created_at: new Date(user.created_at).toLocaleDateString('pt-BR')
    }));
    
    return { success: true, data: formattedUsers };
  } catch (error: any) {
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
      await updateUserRole(userId, dbRole);
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar usuário' };
  }
};

// Remove a user
export const removeUser = async (userId: string): Promise<ServiceResponse> => {
  try {
    await deleteUser(userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao remover usuário' };
  }
};
