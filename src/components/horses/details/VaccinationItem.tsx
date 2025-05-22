
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Syringe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VaccinationItemProps {
  vaccination: {
    name: string;
    date: Date | null;
    applied: boolean;
  };
  onToggle: () => void;
}

export function VaccinationItem({ vaccination, onToggle }: VaccinationItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center space-x-3">
        <Syringe className={vaccination.applied ? "text-green-500" : "text-gray-400"} size={18} />
        <div>
          <p className="font-medium">{vaccination.name}</p>
          {vaccination.date && (
            <p className="text-xs text-gray-500">
              Aplicada em: {format(vaccination.date, "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )}
        </div>
      </div>
      <Button 
        variant={vaccination.applied ? "outline" : "default"}
        size="sm"
        onClick={onToggle}
      >
        {vaccination.applied ? "Aplicada" : "Marcar como aplicada"}
        {vaccination.applied && <Check className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
