<<<<<<< HEAD
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
=======

import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./auth/useAuthProvider";
import { useAuthMethods } from "./auth/useAuthMethods";
import { useRoleChecks } from "./auth/useRoleChecks";
import { AuthContextType } from "./auth/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    session, 
    user, 
    userRole, 
    loading, 
    setLoading 
  } = useAuthProvider();
  
  const { 
    signIn, 
    signUp, 
    signOut 
  } = useAuthMethods();
  
  const { 
    isAdmin, 
    isViewer,
    isEditor 
  } = useRoleChecks(userRole);
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912

  // Wrap the signIn function to set loading
  const wrappedSignIn = async (
    email: string, 
    password: string, 
    onSuccess?: () => void, 
    onError?: (message: string) => void
  ) => {
    setLoading(true);
    try {
<<<<<<< HEAD
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
=======
      await signIn(email, password, onSuccess, onError);
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
    } finally {
      setLoading(false);
    }
  };

  // Wrap the signUp function to set loading
  const wrappedSignUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      await signUp(email, password, fullName);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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

=======
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        loading,
        signIn: wrappedSignIn,
        signUp: wrappedSignUp,
        signOut,
<<<<<<< HEAD
        resetPassword,
        isAdmin,
        isEditor,
        isViewer,
        canEdit
=======
        isAdmin,
        isViewer,
        isEditor
>>>>>>> 5998dc19abbb5bedcc5e25eda2e927264d928912
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
