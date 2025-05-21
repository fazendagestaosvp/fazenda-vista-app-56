import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: "admin" | "editor" | "viewer" | null;
  loading: boolean;
  signIn: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  isAdmin: () => boolean;
  isEditor: () => boolean;
  isViewer: () => boolean;
  canEdit: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "editor" | "viewer" | null>(null);
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

      // Mapear 'user' para 'editor' se necessário (para compatibilidade)
      if (data.role === 'user') {
        setUserRole('editor');
      } else {
        setUserRole(data.role as "admin" | "editor" | "viewer");
      }
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
  
  // Verificar se o usuário é editor
  const isEditor = () => userRole === "editor";
  
  // Verificar se o usuário é apenas visualizador
  const isViewer = () => userRole === "viewer";
  
  // Verificar se o usuário pode editar (admin ou editor)
  const canEdit = () => userRole === "admin" || userRole === "editor";

  // Função para redefinir a senha
  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, message: error.message };
      }

      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha."
      });
      return { success: true, message: "Email de redefinição de senha enviado com sucesso." };
    } catch (error: any) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Ocorreu um erro ao solicitar a redefinição de senha",
        variant: "destructive"
      });
      return { success: false, message: error.message || "Ocorreu um erro ao solicitar a redefinição de senha" };
    }
  };

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
        resetPassword,
        isAdmin,
        isEditor,
        isViewer,
        canEdit
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
