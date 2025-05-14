
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: "admin" | "user" | null;
  loading: boolean;
  signIn: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Inicializar a sessão e configurar o listener de mudanças de autenticação
  useEffect(() => {
    // Configurar o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar a função do usuário quando houver uma sessão
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Verificar se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para buscar a função do usuário (admin ou user)
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar função do usuário:", error);
        return;
      }

      setUserRole(data.role);
    } catch (error) {
      console.error("Erro ao buscar função do usuário:", error);
    }
  };

  // Login com email e senha
  const signIn = async (email: string, password: string, onSuccess?: () => void) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao FazendaPlus!"
      });
      
      // Execute o callback de navegação se fornecido
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Registro de novo usuário
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Faça login para continuar."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro durante o cadastro",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro durante o logout",
        variant: "destructive"
      });
    }
  };

  // Verificar se o usuário é administrador
  const isAdmin = () => userRole === "admin";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
