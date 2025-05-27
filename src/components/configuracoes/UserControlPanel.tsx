
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Users, UserCog, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserControlPanelProps {
  isAdminUser: boolean;
}

export default function UserControlPanel({ isAdminUser }: UserControlPanelProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-farm/20 bg-gradient-to-br from-farm/5 to-farm/10">
      <CardHeader>
        <CardTitle className="flex items-center text-farm">
          <Settings className="mr-2 h-5 w-5" />
          Controle de Usuários
          {!isAdminUser && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">(Debug: Não Admin)</span>}
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
            disabled={!isAdminUser}
          >
            <UserCog className="h-4 w-4" />
            Gerenciar Usuários
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-farm text-farm hover:bg-farm hover:text-white flex items-center justify-center gap-2"
            onClick={() => navigate("/admin/users")}
            disabled={!isAdminUser}
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
              disabled={!isAdminUser}
            >
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1 border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => navigate("/admin/promote-editor")}
              disabled={!isAdminUser}
            >
              <User className="h-3 w-3 mr-1" />
              Editor
            </Button>
            
            <Button 
              size="sm"
              variant="outline"
              className="text-xs px-2 py-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/admin/promote-viewer")}
              disabled={!isAdminUser}
            >
              <Eye className="h-3 w-3 mr-1" />
              Viewer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
