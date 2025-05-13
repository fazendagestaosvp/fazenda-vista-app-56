
import { Button } from "@/components/ui/button";

interface CattleDetailsProps {
  cattle: {
    id: string;
    name: string;
    type: string;
    age: number;
    weight: number;
    gender: string;
    status: string;
    lastCheck: Date;
    coatColor?: string;
    birthSeason?: string;
    observations?: string;
  };
  onClose: () => void;
}

export function CattleDetails({ cattle, onClose }: CattleDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p>{cattle.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Nome</p>
          <p>{cattle.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Raça</p>
          <p>{cattle.type}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Pelagem</p>
          <p>{cattle.coatColor || "Não especificada"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Idade</p>
          <p>{cattle.age} anos</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Época de Nascimento</p>
          <p>{cattle.birthSeason || "Não especificada"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Peso</p>
          <p>{cattle.weight} kg</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Gênero</p>
          <p>{cattle.gender}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p>{cattle.status}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Última Verificação</p>
          <p>{cattle.lastCheck.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}
