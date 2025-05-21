
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, File, Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Document, Folder as FolderType } from "@/hooks/documents";

interface DocumentTableProps {
  isLoading: boolean;
  items: Array<FolderType | Document>;
  onFolderClick: (folder: FolderType) => void;
  onDownload: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export function DocumentTable({ 
  isLoading, 
  items, 
  onFolderClick, 
  onDownload, 
  onDelete 
}: DocumentTableProps) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  return (
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
          {items.length > 0 ? (
            items.map((item) => {
              const isFolder = "parent_id" in item;
              const doc = isFolder ? null : item as Document;
              const folder = isFolder ? item as FolderType : null;
              
              return (
                <TableRow key={item.id}>
                  <TableCell 
                    className="cursor-pointer hover:bg-gray-50" 
                    onClick={() => isFolder && onFolderClick(folder!)}
                  >
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
                            onClick={() => onDownload(doc)}
                            disabled={!doc.file_path}
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-red-500"
                            onClick={() => onDelete(doc)}
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
  );
}
