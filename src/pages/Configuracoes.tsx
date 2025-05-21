
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, Users, UserCog, User } from "lucide-react";

const Configuracoes = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e preferências.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate("/configuracoes/perfil")}
            >
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Atualize sua senha e configurações de segurança.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate("/configuracoes/seguranca")}
            >
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como e quando deseja receber notificações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate("/configuracoes/notificacoes")}
            >
              Configurar Notificações
            </Button>
          </CardContent>
        </Card>

        {isAdmin() && (
          <Card className="border-farm/20 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center text-farm">
                <Shield className="mr-2 h-5 w-5" />
                Administração de Usuários
              </CardTitle>
              <CardDescription>
                Acesso a funções administrativas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/admin/access-control" className="col-span-1">
                <Button className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2 h-12">
                  <UserCog className="h-5 w-5" />
                  Controle de Acesso
                </Button>
              </Link>
              
              <Link to="/admin/users" className="col-span-1">
                <Button className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2 h-12">
                  <Users className="h-5 w-5" />
                  Gerenciamento de Usuários
                </Button>
              </Link>
              
              <div className="col-span-1 space-y-2">
                <Link to="/admin/promote">
                  <Button className="w-full bg-farm-light hover:bg-farm mb-2 flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Promover Administrador
                  </Button>
                </Link>
                
                <Link to="/admin/promote-editor">
                  <Button className="w-full bg-farm-light hover:bg-farm mb-2 flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Promover Editor
                  </Button>
                </Link>
                
                <Link to="/admin/promote-viewer">
                  <Button className="w-full bg-farm-light hover:bg-farm flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Promover Visualizador
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
