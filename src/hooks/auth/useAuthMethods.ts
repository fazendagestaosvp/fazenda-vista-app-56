
// Update import paths to use the refactored services
import { resetUserPassword, signInUser, signOutUser, signUpUser } from "@/services/user";
import { initUserProfile } from "@/services/user";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useAuthMethods = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
        navigate("/login");
        return;
      }

      toast({
        title: "Erro ao registrar",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Erro durante o registro:", error);
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro durante o registro.",
        variant: "destructive",
      });
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
        navigate("/login");
        return;
      }

      toast({
        title: "Erro ao sair",
        description: "Não foi possível sair da sua conta.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Erro durante o logout:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await resetUserPassword({ email });
      
      // Fixed here - checking for success property instead of error
      if (result.success) {
        toast({
          title: "Redefinição de senha solicitada",
          description: "Verifique seu email para continuar!",
        });
        return { success: true, message: "Email de redefinição enviado com sucesso." };
      }

      toast({
        title: "Erro ao redefinir senha",
        description: "Não foi possível solicitar a redefinição de senha.",
        variant: "destructive",
      });
      return { success: false, message: "Erro ao enviar email de redefinição." };
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast({
        title: "Erro ao redefinir senha",
        description:
          error.message || "Ocorreu um erro ao solicitar a redefinição.",
        variant: "destructive",
      });
      return { success: false, message: error.message || "Erro ao solicitar redefinição." };
    }
  };

  return { signIn, signUp, signOut, resetPassword };
};
