
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuthContext";

interface UserTableHeaderProps {
  onAddUser: () => void;
}

export default function UserTableHeader({ onAddUser }: UserTableHeaderProps) {
  const { isAdmin } = useAuth();
  
  // Only show add user button for admins
  if (!isAdmin()) {
    return <div className="mb-4"></div>;
  }
  
  return (
    <div className="flex justify-end mb-4">
      <Button 
        onClick={onAddUser} 
        className="bg-farm hover:bg-farm-dark text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Usuário
      </Button>
    </div>
  );
}
