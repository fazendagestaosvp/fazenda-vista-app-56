
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Search, Plus, Upload, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Sample horse data
const initialHorses = [
  {
    id: "HC-101",
    name: "Ventania",
    age: 5,
    breed: "Quarto de Milha",
    color: "Alazão",
    gender: "Fêmea",
    status: "Ativo",
    sire: "Relâmpago (HC-056)",
    dam: "Aurora (HC-043)",
    birthDate: new Date(2020, 5, 12),
    sireImage: "",
    damImage: "",
  },
  {
    id: "HC-102",
    name: "Trovão Negro",
    age: 7,
    breed: "Mangalarga",
    color: "Preto",
    gender: "Macho",
    status: "Em treinamento",
    sire: "Tempestade (HC-034)",
    dam: "Estrela (HC-028)",
    birthDate: new Date(2018, 3, 15),
    sireImage: "",
    damImage: "",
  },
  {
    id: "HC-103",
    name: "Lua Cheia",
    age: 3,
    breed: "Crioulo",
    color: "Tordilho",
    gender: "Fêmea",
    status: "Ativo",
    sire: "Luar (HC-067)",
    dam: "Noite (HC-052)",
    birthDate: new Date(2022, 1, 8),
    sireImage: "",
    damImage: "",
  },
];

const GestaoCavalos = () => {
  const [horses, setHorses] = useState(initialHorses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHorse, setSelectedHorse] = useState<typeof initialHorses[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredHorses = horses.filter(
    (horse) =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenHorseDetails = (horse: typeof initialHorses[0]) => {
    setSelectedHorse(horse);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "Em treinamento":
        return <Badge className="bg-blue-500">Em treinamento</Badge>;
      case "Em descanso":
        return <Badge className="bg-amber-500">Em descanso</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'sire' | 'dam') => {
    if (event.target.files && event.target.files[0] && selectedHorse) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // Update the horse data
        const updatedHorses = horses.map(horse => {
          if (horse.id === selectedHorse.id) {
            return {
              ...horse,
              [type === 'sire' ? 'sireImage' : 'damImage']: imageUrl
            };
          }
          return horse;
        });
        
        setHorses(updatedHorses);
        
        // Also update the selected horse
        setSelectedHorse({
          ...selectedHorse,
          [type === 'sire' ? 'sireImage' : 'damImage']: imageUrl
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Gestão de Cavalos</h1>
        <p className="text-gray-500">Gerencie seus cavalos e linhagens genéticas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Cavalos</p>
                <h3 className="text-4xl font-bold mt-1">8</h3>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>1.2% último mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fêmeas</p>
                <h3 className="text-4xl font-bold mt-1">5</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>62.5% do total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Machos</p>
                <h3 className="text-4xl font-bold mt-1">3</h3>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <ArrowDown size={14} className="mr-1" />
                  <span>37.5% do total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Button className="bg-farm hover:bg-farm-dark">
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
                  <TableCell>{getStatusBadge(horse.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenHorseDetails(horse)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedHorse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-farm">{selectedHorse.name} ({selectedHorse.id})</DialogTitle>
                <DialogDescription>
                  Detalhes do cavalo e linhagem genética
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="lineage">Linhagem Genética</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 pt-4">
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
                      <p className="text-sm mt-1">{selectedHorse.status}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lineage" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Sire (Father) */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pai (Garanhão)</CardTitle>
                        <CardDescription>{selectedHorse.sire}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center">
                        {selectedHorse.sireImage ? (
                          <div className="relative w-full h-48">
                            <img
                              src={selectedHorse.sireImage}
                              alt="Pai do cavalo"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute bottom-2 right-2"
                              onClick={() => document.getElementById('sire-upload')?.click()}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <input
                              id="sire-upload"
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'sire')}
                            />
                          </div>
                        ) : (
                          <div className="w-full flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Adicionar foto do pai</p>
                            <Input
                              type="file"
                              id="sire-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'sire')}
                            />
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => document.getElementById('sire-upload')?.click()}
                            >
                              Escolher Imagem
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Dam (Mother) */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Mãe (Égua)</CardTitle>
                        <CardDescription>{selectedHorse.dam}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center">
                        {selectedHorse.damImage ? (
                          <div className="relative w-full h-48">
                            <img
                              src={selectedHorse.damImage}
                              alt="Mãe do cavalo"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute bottom-2 right-2"
                              onClick={() => document.getElementById('dam-upload')?.click()}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <input
                              id="dam-upload"
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'dam')}
                            />
                          </div>
                        ) : (
                          <div className="w-full flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Adicionar foto da mãe</p>
                            <Input
                              type="file"
                              id="dam-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'dam')}
                            />
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => document.getElementById('dam-upload')?.click()}
                            >
                              Escolher Imagem
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoCavalos;
