
import { supabase } from "@/integrations/supabase/client";

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

// Service function to reset user password
export const resetUserPassword = async ({ email }: { email: string }) => {
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

// Service function to verify user email
export const verifyUserEmail = async ({ email, token }: { email: string, token: string }) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

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
