
import { Plus, Search, Filter, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AnimalListHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
  canAdd?: boolean;
}

export const AnimalListHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onAddClick,
  canAdd = true // Por padrão, permite adicionar
}: AnimalListHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="Buscar animais..."
          className="pl-10 w-full md:w-80"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filtrar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Todos os animais</DropdownMenuItem>
            <DropdownMenuItem>Bovinos</DropdownMenuItem>
            <DropdownMenuItem>Equinos</DropdownMenuItem>
            <DropdownMenuItem>Machos</DropdownMenuItem>
            <DropdownMenuItem>Fêmeas</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown size={16} />
          Exportar
        </Button>
        
        {canAdd && (
          <Button 
            className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2"
            onClick={onAddClick}
          >
            <Plus size={16} />
            Novo Animal
          </Button>
        )}
      </div>
    </div>
  );
};
