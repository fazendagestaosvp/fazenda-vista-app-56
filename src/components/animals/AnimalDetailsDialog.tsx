
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface AnimalDetailsDialogProps {
  animal: Animal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnimalDetailsDialog = ({ 
  animal, 
  open, 
  onOpenChange 
}: AnimalDetailsDialogProps) => {
  if (!animal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">Detalhes do Animal</DialogTitle>
          <DialogDescription>Informações detalhadas do animal</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Número</p>
                <p>{animal.numero}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identificação</p>
                <p>{animal.identificacao}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sexo</p>
                <p>{animal.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Raça</p>
                <p>{animal.raca}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pelagem</p>
                <p>{"Não especificada"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                <p>{animal.dataNascimento}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Época de Nascimento</p>
                <p>{"Não especificada"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Peso</p>
                <p>{animal.pesoKg} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{animal.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Última Vacinação</p>
                <p>{animal.ultimaVacinacao}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
