
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HorseStatusBadge } from "../HorseStatusBadge";

interface HorseInfoTabContentProps {
  selectedHorse: any;
}

export function HorseInfoTabContent({ selectedHorse }: HorseInfoTabContentProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Raça</Label>
        <p className="text-sm mt-1">{selectedHorse.breed}</p>
      </div>
      <div>
        <Label>Cor</Label>
        <p className="text-sm mt-1">{selectedHorse.color}</p>
      </div>
      <div>
        <Label>Data de Nascimento</Label>
        <p className="text-sm mt-1">
          {format(selectedHorse.birthDate, "dd/MM/yyyy", {
            locale: ptBR,
          })}
        </p>
      </div>
      <div>
        <Label>Idade</Label>
        <p className="text-sm mt-1">{selectedHorse.age} anos</p>
      </div>
      <div>
        <Label>Gênero</Label>
        <p className="text-sm mt-1">{selectedHorse.gender}</p>
      </div>
      <div>
        <Label>Status</Label>
        <p className="text-sm mt-1"><HorseStatusBadge status={selectedHorse.status} /></p>
      </div>
    </div>
  );
}
