
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReproducaoForm } from "./ReproducaoForm";
import { ReproducaoAnimal } from "@/hooks/use-reproducao";

interface ReproducaoAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reproducao: ReproducaoAnimal) => void;
  animalTipo?: "bovino" | "equino";
}

export function ReproducaoAddDialog({
  open,
  onOpenChange,
  onSuccess,
  animalTipo,
}: ReproducaoAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">
            Novo Registro de Reprodução
          </DialogTitle>
          <DialogDescription>
            {animalTipo === "bovino" 
              ? "Adicione um novo registro para bovinos"
              : animalTipo === "equino"
              ? "Adicione um novo registro para equinos"
              : "Adicione um novo registro de reprodução"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <ReproducaoForm
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
            animalTipo={animalTipo}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
