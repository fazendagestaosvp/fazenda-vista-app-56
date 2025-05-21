
import { supabase } from "@/integrations/supabase/client";
import { DbRole, dbToUiRole } from "@/types/user.types";
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

    // Determine role from app_metadata if available, default to viewer
    const roleValue = user.app_metadata?.role as DbRole || 'viewer';
    
    return {
      ...user,
      profile,
      role: dbToUiRole(roleValue),
    };
  } catch (error) {
    console.error("Erro ao obter informações do usuário da sessão:", error);
    return null;
  }
};
