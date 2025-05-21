import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocuments } from "@/hooks/documents";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolder: string | null;
}

export function UploadDocumentDialog({ isOpen, onClose, currentFolder }: UploadDocumentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument } = useDocuments();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      uploadDocument({ 
        file: selectedFile, 
        folderId: currentFolder 
      }, {
        onSuccess: () => {
          setSelectedFile(null);
          onClose();
        },
        onError: (error) => {
          console.error("Erro ao fazer upload:", error);
        },
        onSettled: () => {
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setIsUploading(false);
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo para a sua biblioteca de documentos.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
            onClick={selectFile}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : "Clique para selecionar um arquivo"}
            </p>
            {selectedFile && (
              <p className="text-xs text-gray-400 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? "Enviando..." : "Fazer Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
