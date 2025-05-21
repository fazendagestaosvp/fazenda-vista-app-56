
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAuthMethods() {
  const { toast } = useToast();

  // Login com email e senha
  const signIn = async (
    email: string, 
    password: string, 
    onSuccess?: () => void, 
    onError?: (message: string) => void
  ) => {
    try {
      console.log("Tentando login para:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro na autenticação:", error);
        const errorMsg = error.message === "Invalid login credentials" 
          ? "Credenciais inválidas. Verifique seu email e senha."
          : error.message;
          
        toast({
          title: "Erro ao fazer login",
          description: errorMsg,
          variant: "destructive"
        });
        
        if (onError) {
          onError(errorMsg);
        }
        return;
      }

      console.log("Login bem-sucedido:", data.user?.email);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao FazendaPlus!"
      });
      
      // Execute o callback de navegação se fornecido
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro inesperado durante login:", error);
      const errorMsg = "Ocorreu um erro durante o login: " + (error.message || "Erro desconhecido");
      
      toast({
        title: "Erro ao fazer login",
        description: errorMsg,
        variant: "destructive"
      });
      
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  // Registro de novo usuário
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Registrando novo usuário:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error("Erro no cadastro:", error);
        const errorMsg = error.message === "User already registered" 
          ? "Este email já está cadastrado. Tente fazer login."
          : error.message;
          
        toast({
          title: "Erro ao criar conta",
          description: errorMsg,
          variant: "destructive"
        });
        throw new Error(errorMsg);
      }

      console.log("Cadastro realizado com sucesso:", data.user?.email);
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Faça login para continuar."
      });
    } catch (error: any) {
      console.error("Erro inesperado durante cadastro:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro durante o cadastro",
        variant: "destructive"
      });
      throw error;
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

  return {
    signIn,
    signUp,
    signOut
  };
}
