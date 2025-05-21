
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, User } from "lucide-react";
import { UiRole } from "@/types/user.types";

type UserRoleBadgeProps = {
  role: UiRole;
};

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  switch(role) {
    case 'admin':
      return (
        <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Administrador
        </Badge>
      );
    case 'editor':
      return (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <User className="h-3 w-3" />
          Editor
        </Badge>
      );
    case 'viewer':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
          <Eye className="h-3 w-3" />
          Visualizador
        </Badge>
      );
    default:
      return (
        <Badge className="flex items-center gap-1">
          <User className="h-3 w-3" />
          Usuário
        </Badge>
      );
  }
};

export default UserRoleBadge;
