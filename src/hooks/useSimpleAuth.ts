
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

// Tipo para roles que podem vir do banco de dados
type DbRoleValue = "admin" | "editor" | "viewer" | "user";

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UiRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useSimpleAuth: Inicializando setup de autenticação");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "user:", session?.user?.email || "No user");
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        console.log("Usuário encontrado, buscando role para:", session.user.id);
        await fetchUserRole(session.user.id);
      } else {
        console.log("Nenhum usuário, limpando role");
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      console.log("Verificando sessão existente");
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          setLoading(false);
          return;
        }
        
        console.log("Sessão inicial:", session?.user?.email || "Nenhuma sessão");
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro no getInitialSession:", error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log("Limpando subscription de autenticação");
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("=== FETCHUSERROLE DEBUG ===");
      console.log("1. UserId recebido:", userId);
      console.log("2. Fazendo query para user_roles...");
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      console.log("3. Resposta da query:");
      console.log("   - Data:", data);
      console.log("   - Error:", error);
      console.log("   - Role encontrada no DB:", data?.role);

      if (error) {
        console.error('4. Erro ao buscar role do usuário:', error);
        console.log('5. Definindo role padrão como editor devido ao erro');
        setUserRole('editor');
        return;
      }

      if (data) {
        const dbRole = data.role as DbRoleValue;
        console.log("6. Role no DB (raw):", dbRole);
        console.log("7. Tipo da role:", typeof dbRole);
        
        let mappedRole: UiRole;
        switch (dbRole) {
          case 'admin':
            mappedRole = 'admin';
            console.log("8. Mapeando 'admin' -> 'admin'");
            break;
          case 'viewer':
            mappedRole = 'viewer';
            console.log("8. Mapeando 'viewer' -> 'viewer'");
            break;
          case 'editor':
            mappedRole = 'editor';
            console.log("8. Mapeando 'editor' -> 'editor'");
            break;
          case 'user': // Suporte para backward compatibility
            mappedRole = 'editor';
            console.log("8. Mapeando 'user' -> 'editor'");
            break;
          default:
            mappedRole = 'editor';
            console.log("8. Mapeando '" + dbRole + "' -> 'editor' (default)");
            break;
        }
        
        console.log("9. Role final definida:", mappedRole);
        setUserRole(mappedRole);
      } else {
        console.log("10. Nenhum dado retornado, definindo como editor");
        setUserRole('editor');
      }
      
      console.log("=== FIM FETCHUSERROLE DEBUG ===");
    } catch (error) {
      console.error('Erro crítico ao buscar role do usuário:', error);
      setUserRole('editor');
    }
  };

  // Função para forçar refresh da role - para debug
  const refreshUserRole = async () => {
    if (user) {
      console.log("🔄 REFRESH MANUAL DA ROLE INICIADO");
      await fetchUserRole(user.id);
    } else {
      console.log("❌ Não é possível fazer refresh: usuário não encontrado");
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Tentando fazer login para:", email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Erro no login:", error);
      throw error;
    }
    console.log("Login realizado com sucesso");
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("Tentando registrar usuário:", email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
    console.log("Registro realizado com sucesso");
  };

  const signOut = async () => {
    console.log("Tentando fazer logout");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
    console.log("Logout realizado com sucesso");
  };

  const resetPassword = async (email: string) => {
    console.log("Tentando reset de senha para:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Erro no reset de senha:", error);
      throw error;
    }
    console.log("Email de reset de senha enviado");
  };

  // Role check functions
  const isAdmin = () => {
    const result = userRole === 'admin';
    console.log("isAdmin() check:", userRole, "->", result);
    return result;
  };
  
  const isEditor = () => userRole === 'editor';
  const isViewer = () => userRole === 'viewer';
  const canEdit = () => userRole === 'admin' || userRole === 'editor';

  return {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
    isEditor,
    isViewer,
    canEdit,
    refreshUserRole, // Nova função para debug
  };
};
