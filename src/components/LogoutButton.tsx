
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuthContext";

interface LogoutButtonProps extends ButtonProps {
  redirectTo?: string;
  showIcon?: boolean;
  onLogoutSuccess?: () => void;
}

/**
 * Botão de logout que pode ser usado em qualquer parte da aplicação
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  showIcon = true,
  onLogoutSuccess,
  children,
  ...props
}) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      
      // Executar callback personalizado, se fornecido
      if (result.success && onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
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
