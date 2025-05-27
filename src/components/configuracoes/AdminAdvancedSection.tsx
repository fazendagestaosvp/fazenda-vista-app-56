
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Search } from "lucide-react";
import { useState } from "react";

export default function AdminAdvancedSection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>Controle de Usuários</CardTitle>
            <Badge className="bg-red-100 text-red-800 text-xs">(Debug: Não Admin)</Badge>
          </div>
          <CardDescription>
            Gerencie usuários, níveis de acesso e permissões do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Barra de pesquisa */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Adicionar/Editar Usuários
              </Button>
              <Button variant="outline">
                Conectar Usuários
              </Button>
            </div>

            {/* Cards de tipos de usuário */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Admin */}
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <CardTitle className="text-sm">Admin</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Acesso completo ao sistema</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Gerenciar usuários</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Editor */}
              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm">Editor</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Permissões de edição</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Editar conteúdo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Viewer */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-sm">Viewer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Acesso somente leitura</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Visualizar conteúdo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-2 pt-4">
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate("/user-management")}
              >
                Ver Todos os Usuários
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/admin-role-management")}
              >
                Gerenciar Permissões
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
