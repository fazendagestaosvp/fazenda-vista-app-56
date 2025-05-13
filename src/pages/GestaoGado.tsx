
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";
import { toast } from "@/hooks/use-toast";

// Sample cattle data
const initialCattle = [
  {
    id: "BG-101",
    name: "Estrela",
    age: 3,
    type: "Nelore",
    weight: 480,
    status: "Saudável",
    gender: "Fêmea",
    lastCheck: new Date(2025, 4, 1),
  },
  {
    id: "BG-102",
    name: "Trovão",
    age: 5,
    type: "Angus",
    weight: 650,
    status: "Saudável",
    gender: "Macho",
    lastCheck: new Date(2025, 4, 2),
  },
  {
    id: "BG-103",
    name: "Luna",
    age: 2,
    type: "Nelore",
    weight: 390,
    status: "Em tratamento",
    gender: "Fêmea",
    lastCheck: new Date(2025, 3, 28),
  },
  {
    id: "BG-104",
    name: "Neptuno",
    age: 4,
    type: "Brahman",
    weight: 580,
    status: "Saudável",
    gender: "Macho",
    lastCheck: new Date(2025, 4, 5),
  },
  {
    id: "BG-105",
    name: "Vênus",
    age: 3,
    type: "Nelore",
    weight: 420,
    status: "Em observação",
    gender: "Fêmea",
    lastCheck: new Date(2025, 4, 3),
  },
];

const GestaoGado = () => {
  const [cattle, setCattle] = useState(initialCattle);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentCattle, setCurrentCattle] = useState<any>(null);

  const filteredCattle = cattle.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Saudável":
        return <Badge className="bg-green-500">Saudável</Badge>;
      case "Em tratamento":
        return <Badge className="bg-amber-500">Em tratamento</Badge>;
      case "Em observação":
        return <Badge className="bg-blue-500">Em observação</Badge>;
      case "Doente":
        return <Badge className="bg-red-500">Doente</Badge>;
      case "Vendido":
        return <Badge className="bg-purple-500">Vendido</Badge>;
      case "Óbito":
        return <Badge className="bg-gray-500">Óbito</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddCattleSuccess = () => {
    setIsAddDialogOpen(false);
    // In a real application, we would refresh the cattle list here
  };

  const handleViewCattle = (animal: any) => {
    setCurrentCattle(animal);
    setIsViewDialogOpen(true);
  };

  const handleEditCattle = (animal: any) => {
    setCurrentCattle(animal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCattle = (animalId: string) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      setCattle(cattle.filter(animal => animal.id !== animalId));
      toast({
        title: "Animal excluído",
        description: `O animal com ID ${animalId} foi removido com sucesso.`
      });
    }
  };

  const handleEditSuccess = (updatedAnimal: any) => {
    setCattle(cattle.map(animal => 
      animal.id === updatedAnimal.id ? updatedAnimal : animal
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Animal atualizado",
      description: `As informações do animal ${updatedAnimal.name} foram atualizadas.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Gestão de Gado</h1>
        <p className="text-gray-500">Gerencie seu rebanho de forma eficiente</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Gado</p>
                <h3 className="text-4xl font-bold mt-1">25</h3>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>3.5% último mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Peso Médio</p>
                <h3 className="text-4xl font-bold mt-1">498kg</h3>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>1.8% último mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saúde</p>
                <h3 className="text-4xl font-bold mt-1">92%</h3>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <ArrowDown size={14} className="mr-1" />
                  <span>2.1% último mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-farm">Lista de Gado</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar gado..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                className="bg-farm hover:bg-farm-dark"
                onClick={() => setIsAddDialogOpen(true)}
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
                  <TableCell>{getStatusBadge(animal.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewCattle(animal)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCattle(animal)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCattle(animal.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Cattle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Adicionar Novo Animal</DialogTitle>
          </DialogHeader>
          <AddCattleForm 
            onSuccess={handleAddCattleSuccess}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Cattle Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Detalhes do Animal</DialogTitle>
          </DialogHeader>
          {currentCattle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{currentCattle.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p>{currentCattle.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Raça</p>
                  <p>{currentCattle.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Idade</p>
                  <p>{currentCattle.age} anos</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Peso</p>
                  <p>{currentCattle.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gênero</p>
                  <p>{currentCattle.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>{currentCattle.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Última Verificação</p>
                  <p>{currentCattle.lastCheck.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Cattle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-farm">Editar Animal</DialogTitle>
          </DialogHeader>
          {currentCattle && (
            <AddCattleForm 
              onSuccess={() => handleEditSuccess(currentCattle)}
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={currentCattle}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoGado;
