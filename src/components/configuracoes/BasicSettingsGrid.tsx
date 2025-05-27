
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Shield, Bell, Lock } from "lucide-react";

export default function BasicSettingsGrid() {
  const navigate = useNavigate();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Perfil do Usuário</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Gerencie suas informações pessoais e preferências da conta.
          </CardDescription>
          <Button 
            className="w-full"
            onClick={() => navigate("/user-profile")}
          >
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Segurança</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Configure senha, autenticação e outras opções de segurança.
          </CardDescription>
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => navigate("/security-settings")}
          >
            Configurar Segurança
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base">Notificações</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Personalize suas preferências de notificação.
          </CardDescription>
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600"
            onClick={() => navigate("/notification-settings")}
          >
            Gerenciar Notificações
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
