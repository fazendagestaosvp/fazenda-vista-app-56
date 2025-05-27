
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, UserCog, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminAdvancedSection() {
  return (
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
  );
}
