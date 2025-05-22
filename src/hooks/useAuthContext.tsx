
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./auth/useAuthProvider";
import { useAuthMethods } from "./auth/useAuthMethods";
import { useRoleChecks } from "./auth/useRoleChecks";
import { AuthContextType } from "./auth/types";
import { Session } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
    signOut,
    resetPassword 
  } = useAuthMethods();
  
  const { 
    isAdmin, 
    isViewer,
    isEditor,
    canEdit,
    hasAccessLevel 
  } = useRoleChecks(userRole);
  
  console.log("AuthProvider - userRole:", userRole);
  console.log("AuthProvider - isAdmin:", isAdmin());

  // Wrap the signIn function to set loading
  const wrappedSignIn = async (
    email: string, 
    password: string, 
    onSuccess?: () => void, 
    onError?: (message: string) => void
  ) => {
    setLoading(true);
    try {
      await signIn(email, password, onSuccess, onError);
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

  return (
    <AuthContext.Provider
      value={{
        session: session as Session,
        user,
        userRole,
        loading,
        signIn: wrappedSignIn,
        signUp: wrappedSignUp,
        signOut,
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
