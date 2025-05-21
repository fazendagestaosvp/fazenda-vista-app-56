
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAuthMethods() {
  const { toast } = useToast();

  // Login with email and password
  const signIn = async (
    email: string, 
    password: string, 
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (onError) {
          onError(error.message);
        } else {
          toast({
            title: "Erro ao fazer login",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao FazendaPlus!"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (onError) {
        onError(error.message || "Ocorreu um erro durante o login");
      } else {
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Ocorreu um erro durante o login",
          variant: "destructive"
        });
      }
    }
  };

  // Sign up with email, password, and full name
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
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
        title: "Conta criada",
        description: "Verifique seu email para confirmar seu cadastro."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro durante o cadastro",
        variant: "destructive"
      });
    }
  };

  // Sign out
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

  // Reset password
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
      return { 
        success: false, 
        message: error.message || "Ocorreu um erro ao solicitar a redefinição de senha" 
      };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword
  };
}
