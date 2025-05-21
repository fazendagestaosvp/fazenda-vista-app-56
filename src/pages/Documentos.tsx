
import { useState } from "react";
import { File, FileText, FilePlus, FolderPlus, Search, Download, Trash2, MoreHorizontal, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewFolderDialog } from "@/components/documentos/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documentos/UploadDocumentDialog";
import { useDocuments } from "@/hooks/use-documents";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Folder as FolderType, Document as DocumentType } from "@/hooks/use-documents";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

interface BreadcrumbPath {
  id: string | null;
  name: string;
}

const DocumentosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbPath[]>([
    { id: null, name: "Raiz" }
  ]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const { folders, documents, isLoadingFolders, isLoadingDocuments, deleteDocument, getDownloadUrl } = useDocuments(currentFolder);
  const { toast } = useToast();

  const filteredItems = [...folders, ...documents].filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Para filtrar por categoria no futuro, se necessário
    const matchesCategory = activeTab === "todos" || 
      (activeTab === "pastas" && "parent_id" in item) || 
      (activeTab === "documentos" && "file_path" in item);
    
    return matchesSearch && matchesCategory;
  });

  const navigateToFolder = (folder: FolderType) => {
    setCurrentFolder(folder.id);
    setBreadcrumbPath([...breadcrumbPath, { id: folder.id, name: folder.name }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newPath = breadcrumbPath.slice(0, index + 1);
    setBreadcrumbPath(newPath);
    setCurrentFolder(newPath[newPath.length - 1].id);
  };

  const handleDownload = async (doc: DocumentType) => {
    if (!doc.file_path) {
      toast({
        title: "Erro ao baixar",
        description: "Este documento não possui um arquivo associado.",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = await getDownloadUrl(doc.file_path);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }
  };

  const handleDelete = (doc: DocumentType) => {
    if (confirm(`Deseja realmente excluir o documento "${doc.name}"?`)) {
      deleteDocument({ documentId: doc.id, filePath: doc.file_path });
    }
  };

  const getFileIcon = (type: string | null) => {
    if (!type) return <File className="text-gray-500" size={24} />;
    
    if (type.includes("pdf")) {
      return <File className="text-red-500" size={24} />;
    } else if (type.includes("spreadsheet") || type.includes("excel") || type.includes("xlsx")) {
      return <File className="text-green-600" size={24} />;
    } else if (type.includes("word") || type.includes("document") || type.includes("docx")) {
      return <File className="text-blue-600" size={24} />;
    } else {
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
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsNewFolderDialogOpen(true)}
              >
                <FolderPlus size={16} />
                Nova Pasta
              </Button>
              <Button 
                className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <FilePlus size={16} />
                Novo Documento
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <Breadcrumb>
              {breadcrumbPath.map((item, index) => (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink 
                    onClick={() => navigateToBreadcrumb(index)}
                    className="cursor-pointer hover:underline"
                  >
                    {item.name}
                  </BreadcrumbLink>
                  {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="pastas">Pastas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoadingFolders || isLoadingDocuments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm"></div>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%] md:w-[50%]">Nome</TableHead>
                        <TableHead className="w-[20%] md:w-[20%]">Tipo</TableHead>
                        <TableHead className="w-[20%] md:w-[15%] text-center">Tamanho</TableHead>
                        <TableHead className="hidden md:table-cell w-[15%]">Data</TableHead>
                        <TableHead className="w-[20%] md:w-[10%] text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          const isFolder = "parent_id" in item;
                          const doc = isFolder ? null : item as DocumentType;
                          const folder = isFolder ? item as FolderType : null;
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="cursor-pointer hover:bg-gray-50" onClick={() => {
                                if (isFolder) navigateToFolder(folder!);
                              }}>
                                <div className="flex items-center space-x-3">
                                  {isFolder ? (
                                    <Folder className="text-yellow-500" size={24} />
                                  ) : (
                                    getFileIcon(doc?.file_type || null)
                                  )}
                                  <span className="truncate font-medium">
                                    {item.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-500 capitalize">
                                {isFolder ? "Pasta" : (doc?.file_type?.split('/')[1] || "Documento")}
                              </TableCell>
                              <TableCell className="text-center text-gray-500">
                                {isFolder ? "--" : doc?.file_size || "--"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-gray-500">
                                {new Date(item.created_at).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell className="text-right">
                                {!isFolder && doc && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal size={18} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem 
                                        className="flex items-center gap-2"
                                        onClick={() => handleDownload(doc)}
                                        disabled={!doc.file_path}
                                      >
                                        <Download size={16} />
                                        <span>Download</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="flex items-center gap-2 text-red-500"
                                        onClick={() => handleDelete(doc)}
                                      >
                                        <Trash2 size={16} />
                                        <span>Excluir</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum item encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <NewFolderDialog 
        isOpen={isNewFolderDialogOpen} 
        onClose={() => setIsNewFolderDialogOpen(false)} 
        currentFolder={currentFolder}
      />

      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        currentFolder={currentFolder}
      />
    </div>
  );
};

export default DocumentosPage;
