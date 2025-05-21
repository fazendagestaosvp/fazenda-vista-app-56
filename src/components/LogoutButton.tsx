import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/authService";

interface LogoutButtonProps extends ButtonProps {
  redirectTo?: string;
  showIcon?: boolean;
  onLogoutSuccess?: () => void;
}

/**
 * Botão de logout que pode ser usado em qualquer parte da aplicação
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  redirectTo = "/login",
  showIcon = true,
  onLogoutSuccess,
  children,
  ...props
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logout();
      
      if (result.success) {
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta com sucesso."
        });
        
        // Executar callback personalizado, se fornecido
        if (onLogoutSuccess) {
          onLogoutSuccess();
        }
        
        // Redirecionar para a página especificada
        navigate(redirectTo);
      } else {
        toast({
          title: "Erro ao fazer logout",
          description: result.error || "Ocorreu um erro durante o logout",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro durante o logout",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={handleLogout} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Sair"}
    </Button>
  );
};

export default LogoutButton;
