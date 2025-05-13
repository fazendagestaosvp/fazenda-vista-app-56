import { useState } from "react";
import { Plus, Search, Filter, FileDown, ArrowUp, ArrowDown, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";
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

const mockAnimals: Animal[] = [
  {
    id: "1",
    numero: "25",
    identificacao: "BG-101",
    sexo: "M",
    raca: "Nelore",
    dataNascimento: "10/05/2023",
    pesoKg: 450,
    status: "Ativo",
    ultimaVacinacao: "15/04/2025",
  },
  {
    id: "2",
    numero: "26",
    identificacao: "BG-102",
    sexo: "F",
    raca: "Holandesa",
    dataNascimento: "22/06/2023",
    pesoKg: 380,
    status: "Ativo",
    ultimaVacinacao: "15/04/2025",
  },
  {
    id: "3",
    numero: "27",
    identificacao: "BG-103",
    sexo: "M",
    raca: "Nelore",
    dataNascimento: "05/03/2023",
    pesoKg: 470,
    status: "Ativo",
    ultimaVacinacao: "15/04/2025",
  },
  {
    id: "4",
    numero: "28",
    identificacao: "BG-104",
    sexo: "F",
    raca: "Gir",
    dataNascimento: "18/08/2023",
    pesoKg: 320,
    status: "Ativo",
    ultimaVacinacao: "15/04/2025",
  },
  {
    id: "5",
    numero: "29",
    identificacao: "BG-105",
    sexo: "M",
    raca: "Angus",
    dataNascimento: "30/09/2023",
    pesoKg: 520,
    status: "Ativo",
    ultimaVacinacao: "15/04/2025",
  },
];

const Animais = () => {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Animal | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);

  const handleSort = (field: keyof Animal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAnimals = [...animals].sort((a, b) => {
    if (!sortField) return 0;
    
    const valA = a[sortField];
    const valB = b[sortField];
    
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const filteredAnimals = sortedAnimals.filter(animal => 
    animal.identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ field }: { field: keyof Animal }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };
  
  const handleViewAnimal = (animal: Animal) => {
    setCurrentAnimal(animal);
    setIsViewDialogOpen(true);
  };

  const handleEditAnimal = (animal: Animal) => {
    setCurrentAnimal(animal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAnimal = (animalId: string) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      setAnimals(animals.filter(animal => animal.id !== animalId));
      toast({
        title: "Animal excluído",
        description: `O animal com ID ${animalId} foi removido com sucesso.`
      });
    }
  };

  const handleAddSuccess = (newAnimal: any) => {
    setIsAddDialogOpen(false);
    // In a real app, we would add the new animal to the list
    toast({
      title: "Animal adicionado",
      description: "O animal foi adicionado com sucesso."
    });
  };

  const handleEditSuccess = (updatedAnimal: any) => {
    setAnimals(animals.map(animal => 
      animal.id === updatedAnimal.id ? updatedAnimal : animal
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Animal atualizado",
      description: "As informações do animal foram atualizadas."
    });
  };

  // Convert the animal data to a format compatible with AddCattleForm
  const convertToCattleFormat = (animal: Animal) => {
    return {
      id: animal.identificacao,
      name: animal.numero,
      type: animal.raca,
      coatColor: "", // Add this field
      age: calculateAgeFromDateString(animal.dataNascimento),
      weight: animal.pesoKg,
      status: animal.status,
      gender: animal.sexo === "M" ? "Macho" : "Fêmea",
      lastCheck: new Date(),
      birthSeason: "", // Add this field
      category: "Boi", // Default category
      observations: ""
    };
  };

  // Helper function to calculate age from string date
  const calculateAgeFromDateString = (dateString: string): number => {
    const [day, month, year] = dateString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Animais</h1>
        <p className="text-gray-500">Gerencie seu rebanho e cadastro de animais</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Buscar animais..."
                className="pl-10 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Todos os animais</DropdownMenuItem>
                  <DropdownMenuItem>Bovinos</DropdownMenuItem>
                  <DropdownMenuItem>Equinos</DropdownMenuItem>
                  <DropdownMenuItem>Machos</DropdownMenuItem>
                  <DropdownMenuItem>Fêmeas</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown size={16} />
                Exportar
              </Button>
              
              <Button 
                className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} />
                Novo Animal
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 cursor-pointer" onClick={() => handleSort("numero")}>
                    <div className="flex items-center">
                      Nº <SortIcon field="numero" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("identificacao")}>
                    <div className="flex items-center">
                      Identificação <SortIcon field="identificacao" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("sexo")}>
                    <div className="flex items-center">
                      Sexo <SortIcon field="sexo" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("raca")}>
                    <div className="flex items-center">
                      Raça <SortIcon field="raca" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("dataNascimento")}>
                    <div className="flex items-center">
                      Data de Nascimento <SortIcon field="dataNascimento" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("pesoKg")}>
                    <div className="flex items-center">
                      Peso (kg) <SortIcon field="pesoKg" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("ultimaVacinacao")}>
                    <div className="flex items-center">
                      Última Vacinação <SortIcon field="ultimaVacinacao" />
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnimals.length > 0 ? (
                  filteredAnimals.map((animal) => (
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
                          <Button variant="ghost" size="sm" onClick={() => handleViewAnimal(animal)}>
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditAnimal(animal)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAnimal(animal.id)}>
                            <Trash2 size={16} />
                          </Button>
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
        </CardContent>
      </Card>

      {/* Add Animal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Adicionar Novo Animal</DialogTitle>
            <DialogDescription>Preencha os dados do novo animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <AddCattleForm 
              onSuccess={handleAddSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* View Animal Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Detalhes do Animal</DialogTitle>
            <DialogDescription>Informações detalhadas do animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh] pr-4">
            {currentAnimal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Número</p>
                    <p>{currentAnimal.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Identificação</p>
                    <p>{currentAnimal.identificacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sexo</p>
                    <p>{currentAnimal.sexo === 'M' ? 'Macho' : 'Fêmea'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Raça</p>
                    <p>{currentAnimal.raca}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pelagem</p>
                    <p>{"Não especificada"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                    <p>{currentAnimal.dataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Época de Nascimento</p>
                    <p>{"Não especificada"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Peso</p>
                    <p>{currentAnimal.pesoKg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p>{currentAnimal.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Última Vacinação</p>
                    <p>{currentAnimal.ultimaVacinacao}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Animal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Editar Animal</DialogTitle>
            <DialogDescription>Atualize os dados do animal</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {currentAnimal && (
              <AddCattleForm 
                onSuccess={() => handleEditSuccess(currentAnimal)}
                onCancel={() => setIsEditDialogOpen(false)}
                initialData={convertToCattleFormat(currentAnimal)}
                isEditing={true}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Animais;
