
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, Users, UserCog, User, Settings } from "lucide-react";

const Configuracoes = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  console.log("UserRole em Configuracoes:", userRole);
  
  // Verificação direta do papel do usuário para exibir funcionalidades administrativas
  const isAdminUser = userRole === "ADM";
  
  console.log("isAdminUser:", isAdminUser);

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

        {/* Novo cartão de Controle de Usuários na posição destacada */}
        {isAdminUser && (
          <Card className="border-farm/20 bg-gradient-to-br from-farm/5 to-farm/10">
            <CardHeader>
              <CardTitle className="flex items-center text-farm">
                <Settings className="mr-2 h-5 w-5" />
                Controle de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie usuários, níveis de acesso e permissões do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2"
                  onClick={() => navigate("/admin/role-management")}
                >
                  <UserCog className="h-4 w-4" />
                  Gerenciar Usuários
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-farm text-farm hover:bg-farm hover:text-white flex items-center justify-center gap-2"
                  onClick={() => navigate("/admin/users")}
                >
                  <Users className="h-4 w-4" />
                  Adicionar/Editar Usuários
                </Button>

                <div className="grid grid-cols-3 gap-1 mt-3">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => navigate("/admin/promote")}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => navigate("/admin/promote-editor")}
                  >
                    <User className="h-3 w-3 mr-1" />
                    Editor
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-xs px-2 py-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate("/admin/promote-viewer")}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Viewer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isAdminUser && (
          <Card className="border-farm/20 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center text-farm">
                <Shield className="mr-2 h-5 w-5" />
                Administração Avançada
              </CardTitle>
              <CardDescription>
                Ferramentas avançadas de administração do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/admin/access-control" className="col-span-1">
                <Button className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2 h-12">
                  <UserCog className="h-5 w-5" />
                  Controle de Acesso Detalhado
                </Button>
              </Link>
              
              <Link to="/admin/users" className="col-span-1">
                <Button className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2 h-12">
                  <Users className="h-5 w-5" />
                  Gestão Completa de Usuários
                </Button>
              </Link>
              
              <Link to="/admin/role-management" className="col-span-1">
                <Button className="w-full bg-farm hover:bg-farm-dark flex items-center justify-center gap-2 h-12">
                  <Settings className="h-5 w-5" />
                  Configuração de Papéis
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
