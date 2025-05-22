
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { HorseFormFields, HorseFormValues } from "./HorseFormFields";

interface AddHorseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHorse: (horseData: any) => void;
  standardVaccinations: string[];
}

export function AddHorseDialog({
  isOpen,
  onOpenChange,
  onAddHorse,
  standardVaccinations
}: AddHorseDialogProps) {
  const { toast } = useToast();

  const handleSubmit = (values: HorseFormValues) => {
    // Create a new horse with all required fields
    const newHorse = {
      id: `HC-${Math.floor(Math.random() * 900) + 100}`,
      name: values.name,
      age: values.birthDate ? new Date().getFullYear() - values.birthDate.getFullYear() : 0,
      breed: values.breed,
      color: values.color,
      gender: values.gender,
      status: values.status,
      sire: values.sire || "Não informado",
      dam: values.dam || "Não informado",
      birthDate: values.birthDate || new Date(),
      sireImage: "",
      damImage: "",
      vaccinations: standardVaccinations.map(name => ({
        name,
        date: null,
        applied: false
      })),
      customVaccinations: [],
    };

    // Add the new horse
    onAddHorse(newHorse);

    // Close the dialog
    onOpenChange(false);

    // Show success toast
    toast({
      title: "Cavalo adicionado",
      description: `${newHorse.name} foi adicionado com sucesso.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cavalo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo cavalo
          </DialogDescription>
        </DialogHeader>

        <HorseFormFields 
          onSubmit={handleSubmit} 
          standardVaccinations={standardVaccinations}
          isOpen={isOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
