
import React, { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "./useAuthProvider";
import { useAuthMethods } from "./useAuthMethods";
import { useUserRoleManagement } from "./useUserRoleManagement";
import { AuthContextType } from "./types";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  
  const { 
    session, 
    user, 
    loading: authLoading, 
    setLoading 
  } = useAuthProvider();
  
  const {
    currentUserRole,
    roleLoading,
    isAdmin,
    isViewer,
    isEditor,
    canEdit,
    hasAccessLevel
  } = useUserRoleManagement(user);
  
  const { 
    signIn, 
    signUp, 
    signOut,
    resetPassword 
  } = useAuthMethods();
  
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
  const wrappedSignUp = async (email: string, password: string, fullName: string) => {
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
  const wrappedSignOut = async () => {
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
        userRole: currentUserRole,
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
