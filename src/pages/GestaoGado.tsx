
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddCattleForm } from "@/components/cattle/AddCattleForm";

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
    </div>
  );
};

export default GestaoGado;
