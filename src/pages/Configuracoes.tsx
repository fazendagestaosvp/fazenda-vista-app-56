
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, Users } from "lucide-react";

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
          <>
            <Card className="border-farm/20">
              <CardHeader>
                <CardTitle className="flex items-center text-farm">
                  <Shield className="mr-2 h-5 w-5" />
                  Administração
                </CardTitle>
                <CardDescription>
                  Acesso a funções administrativas do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/promote">
                  <Button className="w-full bg-farm hover:bg-farm-dark mb-2">
                    Promover Administrador
                  </Button>
                </Link>
                <Link to="/admin/promote-viewer">
                  <Button className="w-full bg-farm-light hover:bg-farm">
                    Promover Visualizador
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-farm/20">
              <CardHeader>
                <CardTitle className="flex items-center text-farm">
                  <Users className="mr-2 h-5 w-5" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie os papéis dos usuários.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/users">
                  <Button className="w-full bg-farm hover:bg-farm-dark">
                    Gerenciar Usuários
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
