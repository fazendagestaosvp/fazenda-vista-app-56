
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

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
      console.log("Buscando role para usuário:", userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setUserRole('editor');
        return;
      }

      if (data) {
        const dbRole = data.role;
        console.log("Role do usuário no DB:", dbRole);
        switch (dbRole) {
          case 'admin':
            setUserRole('admin');
            break;
          case 'viewer':
            setUserRole('viewer');
            break;
          default:
            setUserRole('editor');
            break;
        }
      } else {
        console.log("Nenhuma role encontrada, definindo como editor");
        setUserRole('editor');
      }
    } catch (error) {
      console.error('Erro ao buscar role do usuário:', error);
      setUserRole('editor');
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
  const isAdmin = () => userRole === 'admin';
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
  };
};
