
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/services/user/userManagementService";
import { UiRole } from "@/types/user.types";

interface UserRoleSelectProps {
  userId: string;
  currentRole: string;
}

export default function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState<string>(currentRole);
  const { toast } = useToast();

  const handleRoleChange = async (newRole: string) => {
    const result = await updateUser({
      userId,
      role: newRole as UiRole
    });

    if (result.success) {
      setRole(newRole);
      
      toast({
        title: "Papel atualizado",
        description: `O papel do usuário foi atualizado para ${newRole} com sucesso!`,
      });
    } else {
      toast({
        title: "Erro ao atualizar papel",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={role}
      onValueChange={(value) => handleRoleChange(value)}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Administrador</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="viewer">Visualizador</SelectItem>
      </SelectContent>
    </Select>
  );
}
