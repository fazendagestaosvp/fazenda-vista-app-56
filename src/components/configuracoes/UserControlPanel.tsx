
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

interface UserControlPanelProps {
  isAdminUser: boolean;
}

export default function UserControlPanel({ isAdminUser }: UserControlPanelProps) {
  const navigate = useNavigate();

  if (!isAdminUser) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-base">Controle de Usuários</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          Gerencie usuários, níveis de acesso e permissões do sistema.
        </CardDescription>
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate("/user-management")}
        >
          Gerenciar Usuários
        </Button>
      </CardContent>
    </Card>
  );
}
