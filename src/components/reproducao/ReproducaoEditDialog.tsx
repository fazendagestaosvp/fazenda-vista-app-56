
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReproducaoForm } from "./ReproducaoForm";
import { ReproducaoAnimal } from "@/hooks/use-reproducao";

interface ReproducaoEditDialogProps {
  reproducao: ReproducaoAnimal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reproducao: ReproducaoAnimal) => void;
}

export function ReproducaoEditDialog({
  reproducao,
  open,
  onOpenChange,
  onSuccess,
}: ReproducaoEditDialogProps) {
  if (!reproducao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">
            Editar Registro de Reprodução
          </DialogTitle>
          <DialogDescription>
            Protocolo: {reproducao.numeroProtocolo}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <ReproducaoForm
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
            initialData={reproducao}
            isEditing={true}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
