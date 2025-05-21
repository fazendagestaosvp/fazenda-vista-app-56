
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/user.types";
import { InitProfileProps } from "./types";

// Atualizar o perfil de um usuário
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

// Função auxiliar para buscar o perfil do usuário
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // If no profile is found, return null instead of throwing an error
      if (error.message === 'PGRST116: The result of this query is too large (more than 1 row, where only one was expected)') {
        console.warn("More than one profile found for user:", userId);
      } else if (error.message !== 'PGRST116: The result of this query is too large (more than 1 row, where only one was expected)') {
        console.error("Erro ao buscar perfil:", error);
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
};

// Inicializar perfil do usuário
export const initUserProfile = async ({ userId, fullName, avatarUrl = null }: InitProfileProps) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: userId, full_name: fullName, avatar_url: avatarUrl }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar perfil do usuário:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao criar perfil do usuário:", error);
    throw error;
  }
};
