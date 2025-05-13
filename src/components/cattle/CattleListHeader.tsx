
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";

interface CattleListHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onOpenAddDialog: () => void;
}

export function CattleListHeader({ searchTerm, setSearchTerm, onOpenAddDialog }: CattleListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-farm">Lista de Gado</CardTitle>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Buscar gado..."
            className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          className="bg-farm hover:bg-farm-dark"
          onClick={onOpenAddDialog}
        >
          <Plus size={16} className="mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
