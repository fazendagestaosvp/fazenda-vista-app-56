
import { supabase } from "@/integrations/supabase/client";
import { DbRole, dbToUiRole } from "@/types/user.types";
import { UpdateUserAdminProps } from "./types";

// Buscar todos os usuários com seus respectivos perfis
export const getAllUsersWithProfiles = async () => {
  try {
    const { data, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Erro ao listar usuários:", usersError);
      throw usersError;
    }

    // Ensure data.users exists and is an array before mapping
    if (!data || !data.users || !Array.isArray(data.users)) {
      console.error("Dados de usuários inválidos ou vazios");
      return [];
    }

    const usersWithProfiles = await Promise.all(
      data.users.map(async (user) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.message !== 'PGRST116: The result of this query is too large (more than 1 row, where only one was expected)') {
          console.error(`Erro ao buscar perfil para o usuário ${user.id}:`, profileError);
          return { user, profile: null };
        }

        return { user, profile };
      })
    );

    return usersWithProfiles;
  } catch (error) {
    console.error("Erro ao buscar usuários com perfis:", error);
    throw error;
  }
};

// Criar um novo usuário
export const createUser = async (email: string, password?: string) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password || "password", // Defina uma senha padrão ou gere uma aleatória
      email_confirm: true,
    });

    if (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

// Excluir um usuário
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
};

// Buscar um usuário pelo ID
export const getUserById = async (userId: string) => {
  try {
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Erro ao buscar usuário por ID:", userError);
      throw userError;
    }

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    throw error;
  }
};

// Atualizar um usuário (admin)
export const updateUserAdmin = async ({ userId, email, password, role, user_metadata }: UpdateUserAdminProps) => {
  try {
    const updates: {
      email?: string;
      password?: string;
      user_metadata?: { [key: string]: any };
    } = {};

    if (email) updates.email = email;
    if (password) updates.password = password;
    if (user_metadata) updates.user_metadata = user_metadata;

    const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);

    if (error) {
      console.error("Erro ao atualizar usuário (admin):", error);
      throw error;
    }

    // Atualizar role se fornecido
    if (role) {
      await updateUserRole(userId, role);
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar usuário (admin):", error);
    throw error;
  }
};

// Obter informações completas do usuário (auth.user + profile)
export const getCompleteUser = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Erro ao buscar dados do usuário:", userError);
      throw userError;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError && profileError.message !== 'PGRST116: The result of this query is too large (more than 1 row, where only one was expected)') {
      console.error("Erro ao buscar perfil:", profileError);
    }

    if (!userData.user) {
      console.error("Dados do usuário não encontrados.");
      return null;
    }

    return {
      ...userData.user,
      profile,
      role: dbToUiRole(userData.user.app_metadata.role as DbRole),
    };
  } catch (error) {
    console.error("Erro ao obter informações completas do usuário:", error);
    throw error;
  }
};

// Atualizar role do usuário
export const updateUserRole = async (userId: string, role: DbRole) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: role },
    });

    if (error) {
      console.error("Erro ao atualizar role do usuário:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar role do usuário:", error);
    throw error;
  }
};
