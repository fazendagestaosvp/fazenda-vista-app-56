
import { supabase } from "@/integrations/supabase/client";
import { ServiceResponse, SignInProps } from "./types";

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
