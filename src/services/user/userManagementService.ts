
import { supabase } from "@/integrations/supabase/client";
import { DbRole, UiRole, dbToUiRole, uiToDbRole } from "@/types/user.types";
import { ServiceResponse, UpdateUserProps, UserWithProfile } from "./types";
import { updateProfile } from "./profileService";

// Fetch all users for management - modified to use public profiles table
export const fetchUsers = async (): Promise<ServiceResponse<any[]>> => {
  try {
    // Buscar perfis de usuários
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        created_at, 
        email
      `);
    
    if (profilesError) throw profilesError;
    
    // Buscar roles de usuários
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error("Erro ao buscar papéis dos usuários:", rolesError);
    }
    
    // Mapear usuários com seus roles
    const formattedUsers = profiles.map((profile) => {
      // Encontrar o role do usuário, se existir
      const userRole = userRoles?.find(role => role.user_id === profile.id);
      const dbRole = userRole?.role as DbRole || 'viewer';
      
      return {
        id: profile.id,
        name: profile.full_name || profile.email || 'Usuário sem nome',
        email: profile.email,
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
      // Inserir ou atualizar role diretamente na tabela user_roles
      const { error } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: userId, role: dbRole },
          { onConflict: 'user_id' }
        );
        
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao atualizar usuário' };
  }
};

// Remove a user - somente desativa o usuário, não o remove completamente
export const removeUser = async (userId: string): Promise<ServiceResponse> => {
  try {
    // Em vez de excluir o usuário, podemos adicionar um campo 'is_active' na tabela de perfis
    // e marcar como inativo
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao remover usuário' };
  }
};
