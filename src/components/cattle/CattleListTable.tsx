
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CattleStatusBadge } from "./CattleStatusBadge";

interface CattleListTableProps {
  filteredCattle: Array<{
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
  }>;
  onViewCattle: (animal: any) => void;
  onEditCattle: (animal: any) => void;
  onDeleteCattle: (animalId: string) => void;
}

export function CattleListTable({ filteredCattle, onViewCattle, onEditCattle, onDeleteCattle }: CattleListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Raça</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead>Peso (kg)</TableHead>
          <TableHead>Gênero</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCattle.map((animal) => (
          <TableRow key={animal.id}>
            <TableCell className="font-medium">{animal.id}</TableCell>
            <TableCell>{animal.name}</TableCell>
            <TableCell>{animal.type}</TableCell>
            <TableCell>{animal.age} anos</TableCell>
            <TableCell>{animal.weight}</TableCell>
            <TableCell>{animal.gender}</TableCell>
            <TableCell>
              <CattleStatusBadge status={animal.status} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onViewCattle(animal)}>
                  <Eye size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditCattle(animal)}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteCattle(animal.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
