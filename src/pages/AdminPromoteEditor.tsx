
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Shield, Eye } from "lucide-react";
import UserRoleManagement from "@/components/admin/UserRoleManagement";

const AdminPromoteEditor = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/configuracoes")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promover Editores</h2>
          <p className="text-muted-foreground">
            Altere o nível de acesso dos usuários editores.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-700 text-sm">
              <Shield className="mr-2 h-4 w-4" />
              Administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Acesso completo ao sistema, pode gerenciar todos os usuários e configurações.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-green-700 text-sm">
              <User className="mr-2 h-4 w-4" />
              Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Pode criar e editar conteúdo, gerenciar suas próprias informações.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700 text-sm">
              <Eye className="mr-2 h-4 w-4" />
              Visualizador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">
              Acesso somente leitura, pode visualizar conteúdo permitido.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Selecione o novo nível de acesso para cada usuário usando os controles abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserRoleManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPromoteEditor;
