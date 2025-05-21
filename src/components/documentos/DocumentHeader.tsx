
import { Button } from "@/components/ui/button";
import { FilePlus, FolderPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNewFolder: () => void;
  onNewDocument: () => void;
}

export function DocumentHeader({ 
  searchTerm, 
  setSearchTerm, 
  onNewFolder, 
  onNewDocument 
}: DocumentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="search"
          placeholder="Buscar documentos..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onNewFolder}
        >
          <FolderPlus size={16} />
          Nova Pasta
        </Button>
        <Button 
          className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2"
          onClick={onNewDocument}
        >
          <FilePlus size={16} />
          Novo Documento
        </Button>
      </div>
    </div>
  );
}
