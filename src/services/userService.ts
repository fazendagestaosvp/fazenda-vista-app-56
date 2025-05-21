
import { supabase } from "@/integrations/supabase/client";
import { Profile, DbRole, dbToUiRole, uiToDbRole, UiRole } from "@/types/user.types";
import { VerifyOtpParams } from "@supabase/supabase-js";

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
export const updateUserAdmin = async (
  userId: string,
  email?: string,
  password?: string,
  role?: DbRole,
  user_metadata?: { [key: string]: any }
) => {
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

// Obter informações completas do usuário (auth.user + profile)
export const getCompleteUser = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError) {
      console.error("Erro ao buscar dados do usuário:", userError);
      throw userError;
    }

    const profile = await getUserProfile(userId);

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

// Inicializar perfil do usuário
export const initUserProfile = async (userId: string, fullName: string, avatarUrl: string | null = null) => {
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
export const signInUser = async (email: string, password?: string) => {
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
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// Service function to reset user password
export const resetUserPassword = async (email: string) => {
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
export const verifyUserEmail = async (email: string, token: string) => {
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
    const { data: { session }, error } = await supabase.auth.getSession()

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
    const { data: { user }, error } = await supabase.auth.getUser()

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

// New functions to support user management components
export const fetchUsers = async () => {
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

export const updateUser = async ({ 
  userId, 
  fullName, 
  role 
}: { 
  userId: string; 
  fullName?: string; 
  role?: UiRole 
}) => {
  try {
    // Convert UI role to DB role if provided
    const dbRole = role ? uiToDbRole(role) : undefined;
    
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

export const removeUser = async (userId: string) => {
  try {
    await deleteUser(userId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao remover usuário' };
  }
};
