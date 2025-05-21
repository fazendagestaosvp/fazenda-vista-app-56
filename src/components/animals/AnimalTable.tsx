
import { ArrowUp, ArrowDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Animal } from "@/hooks/use-animals-with-auth";

// A interface Animal é importada do hook use-animals-with-auth

interface AnimalTableProps {
  animals: Animal[];
  sortField: keyof Animal | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Animal) => void;
  onView: (animal: Animal) => void;
  onEdit: (animal: Animal) => void;
  onDelete: (animalId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const AnimalTable = ({
  animals,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true
}: AnimalTableProps) => {
  const SortIcon = ({ field }: { field: keyof Animal }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 cursor-pointer" onClick={() => onSort("numero")}>
              <div className="flex items-center">
                Nº <SortIcon field="numero" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("identificacao")}>
              <div className="flex items-center">
                Identificação <SortIcon field="identificacao" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("sexo")}>
              <div className="flex items-center">
                Sexo <SortIcon field="sexo" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("raca")}>
              <div className="flex items-center">
                Raça <SortIcon field="raca" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("dataNascimento")}>
              <div className="flex items-center">
                Data de Nascimento <SortIcon field="dataNascimento" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("pesoKg")}>
              <div className="flex items-center">
                Peso (kg) <SortIcon field="pesoKg" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("status")}>
              <div className="flex items-center">
                Status <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("ultimaVacinacao")}>
              <div className="flex items-center">
                Última Vacinação <SortIcon field="ultimaVacinacao" />
              </div>
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.length > 0 ? (
            animals.map((animal) => (
              <TableRow key={animal.id} className="hover:bg-gray-50">
                <TableCell>{animal.numero}</TableCell>
                <TableCell className="font-medium">{animal.identificacao}</TableCell>
                <TableCell>{animal.sexo}</TableCell>
                <TableCell>{animal.raca}</TableCell>
                <TableCell>{animal.dataNascimento}</TableCell>
                <TableCell>{animal.pesoKg}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    {animal.status}
                  </span>
                </TableCell>
                <TableCell>{animal.ultimaVacinacao}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(animal)}>
                      <Eye size={16} />
                    </Button>
                    {canEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(animal)}>
                        <Pencil size={16} />
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="ghost" size="sm" onClick={() => onDelete(animal.id)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                Nenhum animal encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
