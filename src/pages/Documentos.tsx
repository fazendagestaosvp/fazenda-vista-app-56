
import { useState } from "react";
import { File, FileText, FilePlus, FolderPlus, Search, Download, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  category: string;
}

const mockDocuments: Document[] = [
  { 
    id: "1", 
    name: "Guia de Transporte Animal GTA.pdf", 
    type: "pdf", 
    size: "1.2 MB", 
    lastModified: "03/05/2025",
    category: "legal"
  },
  { 
    id: "2", 
    name: "Relatório Sanitário 2025.pdf", 
    type: "pdf", 
    size: "2.8 MB", 
    lastModified: "28/04/2025",
    category: "report"
  },
  { 
    id: "3", 
    name: "Registro de Vacinações.xlsx", 
    type: "excel", 
    size: "856 KB", 
    lastModified: "15/04/2025",
    category: "management"
  },
  { 
    id: "4", 
    name: "Controle de Estoque.xlsx", 
    type: "excel", 
    size: "1.1 MB", 
    lastModified: "10/04/2025",
    category: "management"
  },
  { 
    id: "5", 
    name: "Escritura da Propriedade.pdf", 
    type: "pdf", 
    size: "5.3 MB", 
    lastModified: "05/01/2025",
    category: "legal"
  },
];

const DocumentosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "todos" || doc.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="text-red-500" size={24} />;
      case "excel":
        return <File className="text-green-600" size={24} />;
      case "word":
        return <File className="text-blue-600" size={24} />;
      default:
        return <File className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Documentos</h1>
        <p className="text-gray-500">Gerencie seus documentos e arquivos da fazenda</p>
      </div>

      <Card>
        <CardContent className="p-6">
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
              <Button variant="outline" className="flex items-center gap-2">
                <FolderPlus size={16} />
                Nova Pasta
              </Button>
              <Button className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2">
                <FilePlus size={16} />
                Novo Documento
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="legal">Documentos Legais</TabsTrigger>
              <TabsTrigger value="management">Gestão</TabsTrigger>
              <TabsTrigger value="report">Relatórios</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500">
                  <div className="col-span-6 md:col-span-6">Nome</div>
                  <div className="col-span-3 md:col-span-2">Tipo</div>
                  <div className="col-span-3 md:col-span-2 text-center">Tamanho</div>
                  <div className="hidden md:block md:col-span-1 text-center">Data</div>
                  <div className="hidden md:block md:col-span-1 text-right">Ações</div>
                </div>
                
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-12 gap-2 p-4 border-b hover:bg-gray-50 items-center">
                      <div className="col-span-6 md:col-span-6 flex items-center space-x-3">
                        {getFileIcon(doc.type)}
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-gray-500 capitalize">
                        {doc.type}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-center text-gray-500">
                        {doc.size}
                      </div>
                      <div className="hidden md:block md:col-span-1 text-center text-gray-500">
                        {doc.lastModified}
                      </div>
                      <div className="hidden md:flex md:col-span-1 justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Download size={16} />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                              <Trash2 size={16} />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Nenhum documento encontrado.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentosPage;
