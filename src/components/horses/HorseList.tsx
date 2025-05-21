
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HorseStatusBadge } from "./HorseStatusBadge";

interface HorseListProps {
  horses: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onOpenAddDialog: () => void;
  onOpenHorseDetails: (horse: any) => void;
}

export function HorseList({
  horses,
  searchTerm,
  setSearchTerm,
  onOpenAddDialog,
  onOpenHorseDetails
}: HorseListProps) {
  // Filter horses based on search term
  const filteredHorses = horses.filter(
    (horse) =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-farm">Lista de Cavalos</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Buscar cavalos..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-farm hover:bg-farm-dark"
              onClick={onOpenAddDialog}
            >
              <Plus size={16} className="mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHorses.map((horse) => (
              <TableRow key={horse.id}>
                <TableCell className="font-medium">{horse.id}</TableCell>
                <TableCell>{horse.name}</TableCell>
                <TableCell>{horse.breed}</TableCell>
                <TableCell>{horse.age} anos</TableCell>
                <TableCell>{horse.color}</TableCell>
                <TableCell>{horse.gender}</TableCell>
                <TableCell><HorseStatusBadge status={horse.status} /></TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenHorseDetails(horse)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
