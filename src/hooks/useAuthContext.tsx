
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./auth/useAuthProvider";
import { useAuthMethods } from "./auth/useAuthMethods";
import { AuthContextType, AuthResult } from "./auth/types";
import { Session } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  
  const { 
    session, 
    user, 
    userRole, 
    loading: authLoading, 
    setLoading 
  } = useAuthProvider();
  
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  
  const { 
    signIn, 
    signUp, 
    signOut,
    resetPassword 
  } = useAuthMethods();
  
  // Buscar role do usuário diretamente aqui, sem usar useUserRole
  useEffect(() => {
    if (user) {
      fetchCurrentUserRole();
    } else {
      setCurrentUserRole(null);
      setRoleLoading(false);
    }
  }, [user]);

  const fetchCurrentUserRole = async () => {
    if (!user) return;

    try {
      setRoleLoading(true);
      
      // Usar a função do banco para obter o role
      const { data, error } = await supabase.rpc('get_user_role', {
        user_id: user.id
      });

      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setCurrentUserRole('EDITOR'); // Default
        return;
      }

      setCurrentUserRole(data || 'EDITOR');
    } catch (error) {
      console.error('Erro ao buscar role:', error);
      setCurrentUserRole('EDITOR');
    } finally {
      setRoleLoading(false);
    }
  };
  
  // Use os role checks baseados no sistema atualizado
  const isAdmin = () => currentUserRole === "ADM";
  const isViewer = () => currentUserRole === "VISUALIZADOR";
  const isEditor = () => currentUserRole === "EDITOR";
  const canEdit = () => currentUserRole === "ADM" || currentUserRole === "EDITOR";
  
  const hasAccessLevel = (minimumLevel: UiRole) => {
    if (!currentUserRole) return false;
    
    if (minimumLevel === "admin") {
      return isAdmin();
    } else if (minimumLevel === "editor") {
      return isAdmin() || isEditor();
    } else {
      return true; // todos os usuários logados podem acessar páginas de nível "viewer"
    }
  };
  
  const loading = authLoading || roleLoading;
  
  console.log("AuthProvider - currentUserRole:", currentUserRole);
  console.log("AuthProvider - isAdmin:", isAdmin());

  // Wrap the signIn function to set loading and handle navigation
  const wrappedSignIn = async (
    email: string, 
    password: string, 
    onSuccess?: () => void, 
    onError?: (message: string) => void
  ) => {
    setLoading(true);
    try {
      await signIn(email, password, 
        () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/dashboard");
          }
        }, 
        onError
      );
    } finally {
      setLoading(false);
    }
  };

  // Wrap the signUp function to set loading and handle navigation
  const wrappedSignUp = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      if (result.success) {
        navigate("/login");
      }
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  // Wrap signOut to handle navigation
  const wrappedSignOut = async (): Promise<AuthResult> => {
    const result = await signOut();
    if (result.success) {
      navigate("/login");
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        session: session as Session,
        user,
        userRole: currentUserRole as UiRole, // Mapeando para compatibilidade
        loading,
        signIn: wrappedSignIn,
        signUp: wrappedSignUp,
        signOut: wrappedSignOut,
        resetPassword,
        isAdmin,
        isViewer,
        isEditor,
        canEdit,
        hasAccessLevel
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
