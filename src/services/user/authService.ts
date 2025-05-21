
import { supabase } from "@/integrations/supabase/client";
import { dbToUiRole, uiToDbRole, UiRole } from "@/types/user.types";
import { ServiceResponse, SignInProps, ResetPasswordProps, VerifyEmailProps } from "./types";
import { VerifyOtpParams } from "@supabase/supabase-js";
import { getUserProfile } from "./profileService";

// Service function to sign up a new user
export const signUpUser = async (email: string, password?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Erro ao registrar usuário:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Service function to sign in an existing user
export const signInUser = async ({ email, password }: SignInProps) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro ao autenticar usuário:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    throw error;
  }
};

// Service function to sign out the current user
export const signOutUser = async (): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao fazer logout' };
  }
};

// Service function to reset user password
export const resetUserPassword = async ({ email }: ResetPasswordProps) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });

    if (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    throw error;
  }
};

// Service function to update user password
export const updateUserPassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Erro ao atualizar senha:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

// Service function to update user email
export const updateUserEmail = async (newEmail: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      console.error("Erro ao atualizar email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar email:", error);
    throw error;
  }
};

// Service function to send an email verification request
export const verifyUserEmail = async ({ email, token }: VerifyEmailProps) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    } as VerifyOtpParams);

    if (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    throw error;
  }
};

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
