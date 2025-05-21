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
      const { data, error } = await signInUser({ email, password });

      if (error) {
        console.error("Erro ao autenticar:", error);
        toast({
          title: "Erro ao autenticar",
          description: "Verifique suas credenciais.",
          variant: "destructive",
        });
        onError?.(error.message);
        return;
      }

      if (data?.user) {
        toast({
          title: "Login realizado",
          description: "Login realizado com sucesso!",
        });
        onSuccess?.();
      }
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
      const { data, error } = await signUpUser(email, password);

      if (error) {
        console.error("Erro ao registrar:", error);
        toast({
          title: "Erro ao registrar",
          description: "Tente novamente ou entre em contato com o suporte.",
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        // Initialize user profile after successful signup
        await initUserProfile({
          userId: data.user.id,
          fullName: fullName,
        });

        toast({
          title: "Registro realizado",
          description: "Confirme seu email para ativar a conta!",
        });
        navigate("/login");
      }
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
      const { error } = await signOutUser();

      if (error) {
        console.error("Erro ao sair:", error);
        toast({
          title: "Erro ao sair",
          description: "Não foi possível sair da sua conta.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Você saiu da sua conta",
        description: "Logout realizado com sucesso!",
      });
      navigate("/login");
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
      const { error } = await resetUserPassword({ email });

      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        toast({
          title: "Erro ao redefinir senha",
          description: "Não foi possível solicitar a redefinição de senha.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Redefinição de senha solicitada",
        description: "Verifique seu email para continuar!",
      });
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast({
        title: "Erro ao redefinir senha",
        description:
          error.message || "Ocorreu um erro ao solicitar a redefinição.",
        variant: "destructive",
      });
    }
  };

  return { signIn, signUp, signOut, resetPassword };
};
