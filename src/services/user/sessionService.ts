
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
    const session = await getCurrentSession();

    if (!session) {
      return null;
    }

    const userId = session.user.id;

    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      throw error;
    }

    const profile = await getUserProfile(userId);

    if (!data.user) {
      console.error("Dados do usuário não encontrados.");
      return null;
    }

    return {
      ...data.user,
      profile,
      role: dbToUiRole(data.user.app_metadata.role as DbRole),
    };
  } catch (error) {
    console.error("Erro ao obter informações do usuário da sessão:", error);
    return null;
  }
};
