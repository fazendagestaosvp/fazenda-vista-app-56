
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocuments } from "@/hooks/use-documents";

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolder: string | null;
}

export function NewFolderDialog({ isOpen, onClose, currentFolder }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createFolder } = useDocuments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) return;
    
    try {
      setIsSubmitting(true);
      createFolder({ 
        name: folderName.trim(), 
        parentId: currentFolder 
      }, {
        onSuccess: () => {
          setFolderName("");
          onClose();
        },
        onError: (error) => {
          console.error("Erro ao criar pasta:", error);
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Pasta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Nome da Pasta</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Digite o nome da pasta"
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !folderName.trim()}>
              {isSubmitting ? "Criando..." : "Criar Pasta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
