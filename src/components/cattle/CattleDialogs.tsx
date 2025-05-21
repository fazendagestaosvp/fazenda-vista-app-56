
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";
import { CattleDetails } from "@/components/cattle/CattleDetails";

interface CattleDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (value: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (value: boolean) => void;
  currentCattle: any;
  onAddSuccess: (newAnimal: any) => void;
  onEditSuccess: (updatedAnimal: any) => void;
}

export function CattleDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  currentCattle,
  onAddSuccess,
  onEditSuccess,
}: CattleDialogsProps) {
  return (
    <>
      {/* Add Cattle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Adicionar Novo Animal</DialogTitle>
            <DialogDescription>Preencha os dados do novo animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <AddCattleForm
              onSuccess={onAddSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* View Cattle Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Detalhes do Animal</DialogTitle>
            <DialogDescription>Informações detalhadas do animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh] pr-4">
            {currentCattle && (
              <CattleDetails cattle={currentCattle} onClose={() => setIsViewDialogOpen(false)} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Cattle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Editar Animal</DialogTitle>
            <DialogDescription>Atualize os dados do animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {currentCattle && (
              <AddCattleForm
                onSuccess={() => onEditSuccess(currentCattle)}
                onCancel={() => setIsEditDialogOpen(false)}
                initialData={currentCattle}
                isEditing={true}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
