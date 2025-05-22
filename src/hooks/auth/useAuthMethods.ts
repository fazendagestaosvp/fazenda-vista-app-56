
// Update import paths to use the refactored services
import { resetUserPassword, signInUser, signOutUser, signUpUser } from "@/services/user";
import { initUserProfile } from "@/services/user";
import { useToast } from "@/components/ui/use-toast";

export const useAuthMethods = () => {
  const { toast } = useToast();
  
  // Remove navigate from here as it causes the Router context issue

  const signIn = async (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => {
    try {
      const result = await signInUser({ email, password });

      if (result.session) {
        toast({
          title: "Login realizado",
          description: "Login realizado com sucesso!",
        });
        onSuccess?.();
        return;
      }

      // If we reach here without a session, there was an error
      toast({
        title: "Erro ao autenticar",
        description: "Verifique suas credenciais.",
        variant: "destructive",
      });
      onError?.("Credenciais inválidas");
    } catch (error: any) {
      console.error("Erro durante o login:", error);
      toast({
        title: "Erro ao autenticar",
        description: error.message || "Ocorreu um erro durante o login.",
        variant: "destructive",
      });
      onError?.(error.message);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await signUpUser(email, password);

      if (result?.user) {
        // Initialize user profile after successful signup
        await initUserProfile({
          userId: result.user.id,
          fullName: fullName,
        });

        toast({
          title: "Registro realizado",
          description: "Confirme seu email para ativar a conta!",
        });
        // Don't navigate here, instead let the caller handle navigation
        return { success: true };
      }

      toast({
        title: "Erro ao registrar",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      });
      return { success: false, error: "Erro ao registrar usuário" };
    } catch (error: any) {
      console.error("Erro durante o registro:", error);
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro durante o registro.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const result = await signOutUser();

      if (result.success) {
        toast({
          title: "Você saiu da sua conta",
          description: "Logout realizado com sucesso!",
        });
        // Return success and let the caller handle navigation
        return { success: true };
      }

      toast({
        title: "Erro ao sair",
        description: "Não foi possível sair da sua conta.",
        variant: "destructive",
      });
      return { success: false, error: "Não foi possível sair da sua conta" };
    } catch (error: any) {
      console.error("Erro durante o logout:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // The resetUserPassword function returns data and not an object with success/error properties
      const data = await resetUserPassword({ email });
      
      // Since data is the direct response and doesn't have a success property,
      // we can consider it successful if we got here without an error
      toast({
        title: "Redefinição de senha solicitada",
        description: "Verifique seu email para continuar!",
      });
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast({
        title: "Erro ao redefinir senha",
        description:
          error.message || "Ocorreu um erro ao solicitar a redefinição.",
        variant: "destructive",
      });
      return { success: false, error: error.message || "Erro ao solicitar redefinição." };
    }
  };

  return { signIn, signUp, signOut, resetPassword };
};
