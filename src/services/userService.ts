
import { supabase } from "@/integrations/supabase/client";

interface UserCreateData {
  email: string;
  password: string;
  fullName: string;
  role: "admin" | "editor" | "viewer";
}

interface UserUpdateData {
  userId: string;
  fullName?: string;
  role?: "admin" | "editor" | "viewer";
}

/**
 * Adiciona um novo usuário ao sistema
 * @param userData Dados do usuário a ser criado
 * @returns Objeto com status da operação e dados do usuário criado ou erro
 */
export const addUser = async (userData: UserCreateData) => {
  try {
    // Obter o token de acesso do usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }
    
    // Chamar a função Edge para criar o usuário
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL || "https://ebddlqmbvwnzzlsbimza.supabase.co"}/functions/v1/create-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role,
        }),
      }
    );
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar usuário');
    }

    return { success: true, data: result.user };
  } catch (error: any) {
    return { success: false, error: error.message || "Ocorreu um erro ao criar o usuário" };
  }
};

/**
 * Atualiza os dados de um usuário existente
 * @param userData Dados do usuário a serem atualizados
 * @returns Objeto com status da operação
 */
export const updateUser = async (userData: UserUpdateData) => {
  try {
    const { userId, fullName, role } = userData;
    
    // Verificar se pelo menos um campo para atualizar foi fornecido
    if (!fullName && !role) {
      throw new Error("Nenhum dado fornecido para atualização");
    }
    
    // Obter o token de acesso do usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }
    
    // Verificar se o usuário atual é administrador
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
      
    if (roleError || !roleData || roleData.role !== 'admin') {
      throw new Error("Acesso negado. Apenas administradores podem atualizar usuários.");
    }
    
    // Atualizar o nome completo, se fornecido
    if (fullName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId);
        
      if (profileError) {
        throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);
      }
    }
    
    // Atualizar o papel, se fornecido
    if (role) {
      // Usar uma abordagem mais simples e direta para evitar problemas com o enum
      // Mapear o papel da UI diretamente para o valor aceito pelo banco
      try {
        // Convert UI role to database role
        let dbRole: "admin" | "viewer" | "user";
        
        if (role === "admin") {
          dbRole = "admin";
        } else if (role === "editor") {
          // 'editor' in UI is stored as 'user' in the database
          dbRole = "user";
        } else {
          dbRole = "viewer";
        }
        
        console.log('Atualizando papel para:', dbRole);
        
        const { error: roleUpdateError } = await supabase
          .from('user_roles')
          .update({ role: dbRole })
          .eq('user_id', userId);
          
        if (roleUpdateError) {
          throw new Error(`Erro ao atualizar papel: ${roleUpdateError.message}`);
        }
      } catch (error: any) {
        console.error('Erro na primeira tentativa:', error);
        
        // Se a primeira abordagem falhar, tentar com uma função Edge
        try {
          // Obter o token de acesso do usuário atual
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error("Sessão expirada. Por favor, faça login novamente.");
          }
          
          // Chamar a função Edge para atualizar o papel (se existir)
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL || "https://ebddlqmbvwnzzlsbimza.supabase.co"}/functions/v1/update-user-role`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                userId,
                // Converter o papel da UI para um formato que a função Edge possa processar
                uiRole: role,
              }),
            }
          );
          
          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Erro ao atualizar papel do usuário');
          }
        } catch (edgeError: any) {
          console.error('Erro ao chamar função Edge:', edgeError);
          throw new Error(`Não foi possível atualizar o papel: ${error.message}`);
        }
      }
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Ocorreu um erro ao atualizar o usuário" };
  }
};

/**
 * Remove um usuário do sistema
 * @param userId ID do usuário a ser removido
 * @returns Objeto com status da operação
 */
export const removeUser = async (userId: string) => {
  try {
    // Obter o token de acesso do usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Sessão expirada. Por favor, faça login novamente.");
    }
    
    // Verificar se o usuário atual é administrador
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
      
    if (roleError || !roleData || roleData.role !== 'admin') {
      throw new Error("Acesso negado. Apenas administradores podem remover usuários.");
    }
    
    // Verificar se o usuário não está tentando remover a si mesmo
    if (userId === session.user.id) {
      throw new Error("Você não pode remover sua própria conta.");
    }
    
    // Remover registros relacionados ao usuário
    // 1. Remover papel do usuário
    const { error: roleDeleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
      
    if (roleDeleteError) {
      throw new Error(`Erro ao remover papel do usuário: ${roleDeleteError.message}`);
    }
    
    // 2. Remover perfil do usuário
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (profileDeleteError) {
      throw new Error(`Erro ao remover perfil do usuário: ${profileDeleteError.message}`);
    }
    
    // 3. Remover o usuário da autenticação (requer função Edge ou acesso admin)
    // Chamar uma função Edge para remover o usuário da autenticação
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL || "https://ebddlqmbvwnzzlsbimza.supabase.co"}/functions/v1/delete-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      }
    );
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro ao remover usuário');
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Ocorreu um erro ao remover o usuário" };
  }
};

/**
 * Busca todos os usuários com seus papéis
 * @returns Lista de usuários com seus papéis
 */
export const fetchUsers = async () => {
  try {
    // Buscar todos os usuários com seus papéis
    const { data: usersWithRoles, error } = await supabase
      .from('user_roles')
      .select('id, user_id, role, created_at');

    if (error) {
      throw error;
    }
    
    // Buscar emails dos usuários
    const userIds = usersWithRoles?.map(item => item.user_id) || [];
    
    // Buscar perfis dos usuários
    const emailMap: Record<string, string> = {};
    
    // Buscar perfil para cada usuário individualmente
    for (const userId of userIds) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', userId)
        .single();
        
      if (data) {
        emailMap[userId] = data.full_name || 'Nome não disponível';
      }
    }

    // Formatar os dados para exibição
    const formattedUsers = usersWithRoles?.map(item => {
      // Converter papel do banco para o formato da UI
      let uiRole: "admin" | "editor" | "viewer";
      
      if (item.role === "admin") {
        uiRole = "admin";
      } else if (item.role === "user") {
        uiRole = "editor"; // Map 'user' from DB to 'editor' in UI
      } else {
        uiRole = "viewer";
      }
      
      return {
        id: item.user_id,
        name: emailMap[item.user_id] || 'Nome não disponível',
        role: uiRole,
        created_at: new Date(item.created_at).toLocaleDateString()
      };
    }) || [];
    
    return { success: true, data: formattedUsers };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Não foi possível carregar a lista de usuários" 
    };
  }
};
