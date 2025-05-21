
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, User } from "lucide-react";
import { UiRole } from "@/types/user.types";

type UserRoleBadgeProps = {
  role: UiRole;
};

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'editor':
        return <Badge className="bg-green-500">Editor</Badge>;
      case 'viewer':
        return <Badge className="bg-blue-500">Visualizador</Badge>;
      default:
        return <Badge>Usuário</Badge>;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'editor':
        return <User className="h-4 w-4 mr-1" />;
      case 'viewer':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex items-center">
      {getRoleIcon(role)}
      {getRoleBadge(role)}
    </div>
  );
};

export default UserRoleBadge;
