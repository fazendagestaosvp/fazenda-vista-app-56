import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthHistoryForm } from "./HealthHistoryForm";
import { HealthRecord } from "@/hooks/use-health-history";

interface HealthHistoryAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (record: HealthRecord) => void;
  animalType?: string;
}

export function HealthHistoryAddDialog({
  open,
  onOpenChange,
  onSuccess,
  animalType,
}: HealthHistoryAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">
            Novo Registro de Saúde
          </DialogTitle>
          <DialogDescription>
            Adicione um novo registro de saúde para o animal
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <HealthHistoryForm
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
            initialData={animalType ? { 
              id: "",
              animalId: "",
              animalName: "",
              animalType: animalType,
              type: "Vacinação",
              procedure: "",
              date: new Date(),
              veterinarian: "",
              notes: "",
              status: "Agendado"
            } as HealthRecord : undefined}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
