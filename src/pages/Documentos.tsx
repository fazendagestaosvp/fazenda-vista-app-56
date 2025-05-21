
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useDocuments } from "@/hooks/documents";
import { Folder as FolderType, Document as DocumentType } from "@/hooks/documents";
import { NewFolderDialog } from "@/components/documentos/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documentos/UploadDocumentDialog";
import { DocumentHeader } from "@/components/documentos/DocumentHeader";
import { DocumentBreadcrumb, BreadcrumbPath } from "@/components/documentos/DocumentBreadcrumb";
import { DocumentFilters } from "@/components/documentos/DocumentFilters";
import { DocumentTable } from "@/components/documentos/DocumentTable";

const DocumentosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbPath[]>([
    { id: null, name: "Raiz" }
  ]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const { 
    folders, 
    documents, 
    isLoadingFolders, 
    isLoadingDocuments, 
    deleteDocument, 
    getDownloadUrl 
  } = useDocuments(currentFolder);
  
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Documentos</h1>
        <p className="text-gray-500">Gerencie seus documentos e arquivos da fazenda</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <DocumentHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewFolder={() => setIsNewFolderDialogOpen(true)}
            onNewDocument={() => setIsUploadDialogOpen(true)}
          />
          
          <DocumentBreadcrumb 
            breadcrumbPath={breadcrumbPath} 
            onNavigate={navigateToBreadcrumb}
          />
          
          <DocumentFilters 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          >
            <DocumentTable 
              isLoading={isLoadingFolders || isLoadingDocuments}
              items={filteredItems}
              onFolderClick={navigateToFolder}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </DocumentFilters>
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
