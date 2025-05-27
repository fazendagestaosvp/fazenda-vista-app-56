
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Key, Bell } from "lucide-react";

export default function BasicSettingsGrid() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const getRoleBadge = () => {
    switch (userRole) {
      case "admin":
        return <Badge className="bg-red-500 text-white">Editor</Badge>;
      case "editor":
        return <Badge className="bg-green-500 text-white">Editor</Badge>;
      case "viewer":
        return <Badge className="bg-blue-500 text-white">Viewer</Badge>;
      default:
        return <Badge>Usuário</Badge>;
    }
  };

  const getStatusBadge = () => {
    return userRole === "admin" ? 
      <Badge className="bg-green-500 text-white">Ativo</Badge> : 
      <Badge className="bg-yellow-500 text-white">Não Admin</Badge>;
  };

  return (
    <>
      {/* Perfil do Usuário */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Perfil do Usuário</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Gerencie suas informações pessoais e preferências.
          </CardDescription>
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Usuário Editor</span>
            </div>
            <div className="text-sm text-gray-600">{user?.email}</div>
            <div>
              <span className="text-sm">Seu nível de acesso: </span>
              {getRoleBadge()}
            </div>
            <div className="text-xs text-gray-500">Última atualização: 27/05/2025</div>
            <div>
              <span className="text-sm">Status admin: </span>
              {getStatusBadge()}
            </div>
          </div>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/user-profile")}
          >
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Segurança</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Atualize sua senha e configurações de segurança.
          </CardDescription>
          <div className="space-y-2 mb-4">
            <div className="text-sm">Última atualização: 27/05/2025</div>
            <div className="text-sm">
              <span>Autenticação de dois fatores: </span>
              <Badge variant="destructive">Desativada</Badge>
            </div>
          </div>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/security-settings")}
          >
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Notificações</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Configure como e quando deseja receber notificações.
          </CardDescription>
          <div className="space-y-2 mb-4">
            <div className="text-sm">
              <span>E-mail: </span>
              <Badge className="bg-green-500">Ativado</Badge>
            </div>
            <div className="text-sm">
              <span>Notificações push: </span>
              <Badge variant="destructive">Desativado</Badge>
            </div>
          </div>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/notification-settings")}
          >
            Configurar Notificações
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
