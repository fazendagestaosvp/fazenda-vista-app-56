
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface UserTableHeaderProps {
  onAddUser: () => void;
}

export default function UserTableHeader({ onAddUser }: UserTableHeaderProps) {
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
