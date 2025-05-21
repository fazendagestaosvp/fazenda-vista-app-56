
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import UserManagementTable from "@/components/users/UserManagementTable";

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se é admin e redirecionar se não for
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);
  
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
