
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, Edit, Trash, Stethoscope } from "lucide-react";
import { 
  MetodoReproducao, 
  ReproducaoAnimal, 
  StatusPrenhez 
} from "@/hooks/use-reproducao";

interface ReproducaoTableProps {
  reproducoes: ReproducaoAnimal[];
  onView: (reproducao: ReproducaoAnimal) => void;
  onEdit: (reproducao: ReproducaoAnimal) => void;
  onUltrassom: (reproducao: ReproducaoAnimal) => void;
  onDelete: (id: string) => void;
}

// Funções auxiliares para formato e cores
const getMetodoLabel = (metodo: MetodoReproducao) => {
  switch (metodo) {
    case "TOURE": return "Monta Natural";
    case "IATF": return "IATF";
    case "REPASSE": return "Repasse";
    default: return metodo;
  }
};

const getStatusColor = (status: StatusPrenhez) => {
  switch (status) {
    case "PRENHA": return "bg-green-100 text-green-800";
    case "FALHADA": return "bg-red-100 text-red-800";
    case "PENDENTE": return "bg-yellow-100 text-yellow-800";
    case "FINALIZADA": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: StatusPrenhez) => {
  switch (status) {
    case "PRENHA": return "Prenha";
    case "FALHADA": return "Falhada";
    case "PENDENTE": return "Pendente";
    case "FINALIZADA": return "Finalizada";
    default: return status;
  }
};

const getTipoAnimalLabel = (tipo: string) => {
  return tipo === "bovino" ? "Bovino" : "Equino";
};

export function ReproducaoTable({
  reproducoes,
  onView,
  onEdit,
  onUltrassom,
  onDelete,
}: ReproducaoTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Animal</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ultrassons</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reproducoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                Nenhum registro de reprodução encontrado
              </TableCell>
            </TableRow>
          ) : (
            reproducoes.map((reproducao) => (
              <TableRow key={reproducao.id}>
                <TableCell className="font-medium">{reproducao.numeroProtocolo}</TableCell>
                <TableCell>
                  <div className="font-medium">{reproducao.animalIdentificacao}</div>
                  <div className="text-xs text-gray-500">{reproducao.animalNome}</div>
                </TableCell>
                <TableCell>{getTipoAnimalLabel(reproducao.tipoAnimal)}</TableCell>
                <TableCell>{getMetodoLabel(reproducao.metodo)}</TableCell>
                <TableCell>{format(reproducao.dataInicio, "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(reproducao.statusPrenhez)}>
                    {getStatusLabel(reproducao.statusPrenhez)}
                  </Badge>
                </TableCell>
                <TableCell>{reproducao.ultrassons.length}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(reproducao)}
                    title="Ver detalhes"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {reproducao.statusPrenhez !== "FINALIZADA" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUltrassom(reproducao)}
                        title="Registrar ultrassom"
                        type="button"
                      >
                        <Stethoscope className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(reproducao)}
                        title="Editar registro"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reproducao.id)}
                        title="Excluir registro"
                        type="button"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
