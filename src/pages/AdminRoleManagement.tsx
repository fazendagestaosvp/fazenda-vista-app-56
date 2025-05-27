
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UserRoleManagement from "@/components/admin/UserRoleManagement";

const AdminRoleManagement = () => {
  const { userRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast, isAdmin]);

  return <UserRoleManagement />;
};

export default AdminRoleManagement;
