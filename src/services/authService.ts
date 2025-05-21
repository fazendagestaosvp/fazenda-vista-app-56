import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

/**
 * Serviço para gerenciar operações de autenticação
 */

/**
 * Realiza o logout do usuário
 * @param onSuccess Callback opcional executado após o logout bem-sucedido
 * @returns Objeto com status da operação
 */
export const logout = async (onSuccess?: () => void) => {
  try {
    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Limpar quaisquer dados locais de sessão, se necessário
    localStorage.removeItem('supabase.auth.token');
    
    // Executar o callback de sucesso, se fornecido
    if (onSuccess) {
      onSuccess();
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    return { 
      success: false, 
      error: error.message || 'Ocorreu um erro ao fazer logout' 
    };
  }
};

/**
 * Hook para fornecer a funcionalidade de logout com redirecionamento
 * @param redirectPath Caminho para redirecionar após o logout (padrão: '/login')
 * @returns Função de logout com redirecionamento
 */
export const useLogout = (redirectPath = '/login') => {
  const navigate = useNavigate();
  
  /**
   * Faz logout e redireciona para a página especificada
   */
  const logoutAndRedirect = async () => {
    const result = await logout(() => {
      navigate(redirectPath);
    });
    
    return result;
  };
  
  return logoutAndRedirect;
};

/**
 * Verifica se o usuário está autenticado
 * @returns Promise com o status de autenticação
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

/**
 * Obtém o usuário atual
 * @returns Objeto com os dados do usuário atual ou null
 */
export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};
