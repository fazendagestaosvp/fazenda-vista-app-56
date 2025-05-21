
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import UserManagementTable from "@/components/users/UserManagementTable";
import { useToast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log("UserRole em UserManagement:", userRole);
  
  // Verificar se é admin e redirecionar se não for
  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast]);
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Gerencie os papéis e permissões dos usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
