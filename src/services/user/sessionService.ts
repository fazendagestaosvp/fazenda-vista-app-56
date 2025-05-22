
import { supabase } from "@/integrations/supabase/client";
import { DbRole, mapDbRoleToUiRole } from "@/types/user.types";
import { getUserProfile } from "./profileService";

// Service function to get the current user session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Erro ao obter sessão:", error);
      throw error;
    }

    return session;
  } catch (error) {
    console.error("Erro ao obter sessão:", error);
    throw error;
  }
};

// Service function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Erro ao obter usuário:", error);
      throw error;
    }

    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw error;
  }
};

// Service function to get the current user with profile and role
export const getSessionUser = async () => {
  try {
    // Get the current session
    const session = await getCurrentSession();

    if (!session) {
      console.log("No active session found");
      return null;
    }

    // Get the user directly from the session
    const user = session.user;
    
    if (!user) {
      console.error("Dados do usuário não encontrados na sessão.");
      return null;
    }

    // Get user profile from profiles table
    const profile = await getUserProfile(user.id);

    // Check for user role in user_roles table
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (rolesError && rolesError.code !== 'PGRST116') {
      console.error("Erro ao buscar papel do usuário:", rolesError);
    }
    
    // Get role from user_roles if available, otherwise use app_metadata or default to viewer
    let roleValue: DbRole;
    
    if (userRoles?.role) {
      roleValue = userRoles.role as DbRole;
      console.log("Role from user_roles table:", roleValue);
    } else {
      roleValue = user.app_metadata?.role as DbRole || 'viewer';
      console.log("Role from app_metadata or default:", roleValue);
    }
    
    // For debugging: Force admin role for development
    // Uncomment this line if you need to force admin role for testing
    // roleValue = 'admin';
    
    const uiRole = mapDbRoleToUiRole(roleValue);
    console.log("Final UI role:", uiRole);
    
    return {
      ...user,
      profile,
      role: uiRole,
    };
  } catch (error) {
    console.error("Erro ao obter informações do usuário da sessão:", error);
    return null;
  }
};
