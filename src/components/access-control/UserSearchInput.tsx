
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type UserSearchInputProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const UserSearchInput = ({ searchTerm, setSearchTerm }: UserSearchInputProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar usuário por email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default UserSearchInput;
