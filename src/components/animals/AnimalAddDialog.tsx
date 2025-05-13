
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";

interface AnimalAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AnimalAddDialog = ({ 
  open, 
  onOpenChange,
  onSuccess
}: AnimalAddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">Adicionar Novo Animal</DialogTitle>
          <DialogDescription>Preencha os dados do novo animal</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <AddCattleForm 
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
