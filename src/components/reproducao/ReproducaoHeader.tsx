
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface ReproducaoHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  animalTipo?: "bovino" | "equino";
}

export function ReproducaoHeader({
  searchTerm,
  onSearchChange,
  onAddClick,
  animalTipo
}: ReproducaoHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar registro..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button
        onClick={onAddClick}
        className="bg-farm hover:bg-farm-dark flex gap-2"
      >
        <Plus size={16} />
        <span>Novo Registro {animalTipo && (animalTipo === "bovino" ? "(Bovino)" : "(Equino)")}</span>
      </Button>
    </div>
  );
}
