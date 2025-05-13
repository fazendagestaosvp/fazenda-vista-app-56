
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";

interface Animal {
  id: string;
  numero: string;
  identificacao: string;
  sexo: "M" | "F";
  raca: string;
  dataNascimento: string;
  pesoKg: number;
  status: "Ativo" | "Vendido" | "Óbito";
  ultimaVacinacao: string;
}

interface AnimalEditDialogProps {
  animal: Animal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (animal?: any) => void;
  convertToCattleFormat: (animal: Animal) => any;
}

export const AnimalEditDialog = ({ 
  animal, 
  open, 
  onOpenChange,
  onSuccess,
  convertToCattleFormat
}: AnimalEditDialogProps) => {
  if (!animal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">Editar Animal</DialogTitle>
          <DialogDescription>Atualize os dados do animal</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <AddCattleForm 
            onSuccess={() => onSuccess(animal)}
            onCancel={() => onOpenChange(false)}
            initialData={convertToCattleFormat(animal)}
            isEditing={true}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
