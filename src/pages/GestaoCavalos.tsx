
import React, { useState } from "react";
import { ArrowDown, ArrowUp, Search, Plus, Upload, Camera, Check, AlertTriangle, Syringe } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the horse schema
const horseSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres",
  }),
  breed: z.string().min(1, {
    message: "Selecione uma raça",
  }),
  color: z.string().min(1, {
    message: "Selecione uma cor",
  }),
  gender: z.string().min(1, {
    message: "Selecione um gênero",
  }),
  status: z.string().min(1, {
    message: "Selecione um status",
  }),
  sire: z.string().optional(),
  dam: z.string().optional(),
  birthDate: z.date().optional(),
  vaccinations: z.array(z.object({
    name: z.string(),
    date: z.date().optional(),
    applied: z.boolean().default(false),
  })),
  customVaccinations: z.array(z.object({
    name: z.string(),
    date: z.date().optional(),
    applied: z.boolean().default(false),
  })).default([]),
});

// Sample horse data
const initialHorses = [
  {
    id: "HC-101",
    name: "Ventania",
    age: 5,
    breed: "Quarto de Milha",
    color: "Alazão",
    gender: "Fêmea",
    status: "Ativo - Domado",
    sire: "Relâmpago (HC-056)",
    dam: "Aurora (HC-043)",
    birthDate: new Date(2020, 5, 12),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2023, 2, 15), applied: true },
      { name: "Leptospirose", date: new Date(2023, 5, 20), applied: true },
      { name: "Mórmon", date: null, applied: false },
      { name: "Influenza", date: new Date(2023, 8, 10), applied: true },
      { name: "Encefalomielite", date: new Date(2023, 11, 5), applied: true },
      { name: "Garrotilho", date: null, applied: false },
    ],
    customVaccinations: [],
  },
  {
    id: "HC-102",
    name: "Trovão Negro",
    age: 7,
    breed: "Mangalarga",
    color: "Preto",
    gender: "Macho",
    status: "Em treinamento - Em doma",
    sire: "Tempestade (HC-034)",
    dam: "Estrela (HC-028)",
    birthDate: new Date(2018, 3, 15),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2022, 1, 10), applied: true },
      { name: "Leptospirose", date: new Date(2022, 4, 12), applied: true },
      { name: "Mórmon", date: new Date(2022, 7, 15), applied: true },
      { name: "Influenza", date: new Date(2022, 10, 8), applied: true },
      { name: "Encefalomielite", date: new Date(2023, 1, 7), applied: true },
      { name: "Garrotilho", date: new Date(2023, 4, 9), applied: true },
    ],
    customVaccinations: [
      { name: "Tétano", date: new Date(2023, 3, 25), applied: true },
    ],
  },
  {
    id: "HC-103",
    name: "Lua Cheia",
    age: 3,
    breed: "Crioulo",
    color: "Tordilho",
    gender: "Fêmea",
    status: "Vendido - Potro",
    sire: "Luar (HC-067)",
    dam: "Noite (HC-052)",
    birthDate: new Date(2022, 1, 8),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2023, 2, 15), applied: true },
      { name: "Leptospirose", date: new Date(2023, 5, 20), applied: true },
      { name: "Mórmon", date: null, applied: false },
      { name: "Influenza", date: new Date(2023, 8, 10), applied: true },
      { name: "Encefalomielite", date: null, applied: false },
      { name: "Garrotilho", date: null, applied: false },
    ],
    customVaccinations: [],
  },
];

// Define the standard vaccinations
const standardVaccinations = [
  "Herpes",
  "Leptospirose",
  "Mórmon",
  "Influenza",
  "Encefalomielite",
  "Garrotilho"
];

const GestaoCavalos = () => {
  const [horses, setHorses] = useState(initialHorses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHorse, setSelectedHorse] = useState<typeof initialHorses[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddHorseDialogOpen, setIsAddHorseDialogOpen] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof horseSchema>>({
    resolver: zodResolver(horseSchema),
    defaultValues: {
      name: "",
      breed: "",
      color: "",
      gender: "",
      status: "Ativo - Potro",
      vaccinations: standardVaccinations.map(name => ({ name, date: null, applied: false })),
      customVaccinations: [],
    },
  });

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
    // Extrair a primeira parte do status (antes do hífen)
    const statusParts = status.split(" - ");
    const mainStatus = statusParts[0];
    const trainingStatus = statusParts[1] || "";
    
    let badgeColor = "";
    
    switch (mainStatus) {
      case "Ativo":
        badgeColor = "bg-green-500";
        break;
      case "Em treinamento":
        badgeColor = "bg-blue-500";
        break;
      case "Em descanso":
        badgeColor = "bg-amber-500";
        break;
      case "Vendido":
        badgeColor = "bg-purple-500";
        break;
      case "Morto":
        badgeColor = "bg-red-500";
        break;
      case "Inseminado":
        badgeColor = "bg-pink-500";
        break;
      default:
        badgeColor = "";
    }
    
    return <Badge className={badgeColor}>{status}</Badge>;
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

  const handleToggleVaccination = (vaccinationName: string, isCustom: boolean = false) => {
    if (!selectedHorse) return;
    
    const updatedHorses = horses.map(horse => {
      if (horse.id === selectedHorse.id) {
        if (isCustom) {
          const updatedCustomVaccinations = horse.customVaccinations.map(vacc => {
            if (vacc.name === vaccinationName) {
              return { ...vacc, applied: !vacc.applied, date: !vacc.applied ? new Date() : vacc.date };
            }
            return vacc;
          });
          return { ...horse, customVaccinations: updatedCustomVaccinations };
        } else {
          const updatedVaccinations = horse.vaccinations.map(vacc => {
            if (vacc.name === vaccinationName) {
              return { ...vacc, applied: !vacc.applied, date: !vacc.applied ? new Date() : vacc.date };
            }
            return vacc;
          });
          return { ...horse, vaccinations: updatedVaccinations };
        }
      }
      return horse;
    });
    
    setHorses(updatedHorses);
    
    // Update selected horse
    const updatedHorse = updatedHorses.find(horse => horse.id === selectedHorse.id);
    if (updatedHorse) {
      setSelectedHorse(updatedHorse);
    }
    
    toast({
      title: "Vacinação atualizada",
      description: "O status da vacinação foi atualizado com sucesso.",
    });
  };

  const handleAddCustomVaccine = () => {
    if (!selectedHorse || !newVaccineName.trim()) return;
    
    // Check if vaccine already exists
    const alreadyExists = selectedHorse.vaccinations.some(v => v.name.toLowerCase() === newVaccineName.toLowerCase()) || 
                          selectedHorse.customVaccinations.some(v => v.name.toLowerCase() === newVaccineName.toLowerCase());
    
    if (alreadyExists) {
      toast({
        title: "Erro",
        description: "Esta vacina já existe na lista.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedHorses = horses.map(horse => {
      if (horse.id === selectedHorse.id) {
        return { 
          ...horse, 
          customVaccinations: [
            ...horse.customVaccinations,
            { name: newVaccineName, date: null, applied: false }
          ]
        };
      }
      return horse;
    });
    
    setHorses(updatedHorses);
    
    // Update selected horse
    const updatedHorse = updatedHorses.find(horse => horse.id === selectedHorse.id);
    if (updatedHorse) {
      setSelectedHorse(updatedHorse);
    }
    
    toast({
      title: "Vacina adicionada",
      description: `A vacina ${newVaccineName} foi adicionada com sucesso.`
    });
    
    setNewVaccineName("");
  };

  const onSubmit = (values: z.infer<typeof horseSchema>) => {
    const newHorse = {
      id: `HC-${Math.floor(Math.random() * 900) + 100}`,
      name: values.name,
      age: new Date().getFullYear() - (values.birthDate ? values.birthDate.getFullYear() : new Date().getFullYear()),
      breed: values.breed,
      color: values.color,
      gender: values.gender,
      status: values.status,
      sire: values.sire || "Não informado",
      dam: values.dam || "Não informado",
      birthDate: values.birthDate || new Date(),
      sireImage: "",
      damImage: "",
      vaccinations: standardVaccinations.map(name => ({ 
        name, 
        date: null, 
        applied: false 
      })),
      customVaccinations: [],
    };

    setHorses([...horses, newHorse]);
    setIsAddHorseDialogOpen(false);
    form.reset();
    
    toast({
      title: "Cavalo adicionado",
      description: `${newHorse.name} foi adicionado com sucesso.`
    });
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
                <h3 className="text-4xl font-bold mt-1">{horses.length}</h3>
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
                <h3 className="text-4xl font-bold mt-1">
                  {horses.filter(h => h.gender === "Fêmea").length}
                </h3>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>{Math.round((horses.filter(h => h.gender === "Fêmea").length / horses.length) * 100)}% do total</span>
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
                <h3 className="text-4xl font-bold mt-1">
                  {horses.filter(h => h.gender === "Macho").length}
                </h3>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <ArrowDown size={14} className="mr-1" />
                  <span>{Math.round((horses.filter(h => h.gender === "Macho").length / horses.length) * 100)}% do total</span>
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
              <Button 
                className="bg-farm hover:bg-farm-dark"
                onClick={() => setIsAddHorseDialogOpen(true)}
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="lineage">Linhagem Genética</TabsTrigger>
                  <TabsTrigger value="health">Saúde</TabsTrigger>
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
                      <p className="text-sm mt-1">{getStatusBadge(selectedHorse.status)}</p>
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

                <TabsContent value="health" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vacinas</CardTitle>
                      <CardDescription>Histórico de vacinação do animal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedHorse.vaccinations.map((vacc) => (
                            <div key={vacc.name} className="flex items-center justify-between p-3 border rounded-md">
                              <div className="flex items-center space-x-3">
                                <Syringe className={vacc.applied ? "text-green-500" : "text-gray-400"} size={18} />
                                <div>
                                  <p className="font-medium">{vacc.name}</p>
                                  {vacc.date && (
                                    <p className="text-xs text-gray-500">
                                      Aplicada em: {format(vacc.date, "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant={vacc.applied ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleToggleVaccination(vacc.name)}
                              >
                                {vacc.applied ? "Aplicada" : "Marcar como aplicada"}
                                {vacc.applied && <Check className="ml-2 h-4 w-4" />}
                              </Button>
                            </div>
                          ))}

                          {selectedHorse.customVaccinations.length > 0 && (
                            <div className="md:col-span-2 mt-4">
                              <h4 className="text-sm font-semibold mb-2">Outras vacinas</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedHorse.customVaccinations.map((vacc) => (
                                  <div key={vacc.name} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center space-x-3">
                                      <Syringe className={vacc.applied ? "text-green-500" : "text-gray-400"} size={18} />
                                      <div>
                                        <p className="font-medium">{vacc.name}</p>
                                        {vacc.date && (
                                          <p className="text-xs text-gray-500">
                                            Aplicada em: {format(vacc.date, "dd/MM/yyyy", { locale: ptBR })}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <Button 
                                      variant={vacc.applied ? "outline" : "default"}
                                      size="sm"
                                      onClick={() => handleToggleVaccination(vacc.name, true)}
                                    >
                                      {vacc.applied ? "Aplicada" : "Marcar como aplicada"}
                                      {vacc.applied && <Check className="ml-2 h-4 w-4" />}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <Label htmlFor="new-vaccine" className="block mb-2">Adicionar nova vacina</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="new-vaccine" 
                              placeholder="Nome da vacina" 
                              value={newVaccineName}
                              onChange={(e) => setNewVaccineName(e.target.value)}
                            />
                            <Button 
                              variant="outline" 
                              onClick={handleAddCustomVaccine} 
                              disabled={!newVaccineName.trim()}
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

      <Dialog open={isAddHorseDialogOpen} onOpenChange={setIsAddHorseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cavalo</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo cavalo
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cavalo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raça</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a raça" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Quarto de Milha">Quarto de Milha</SelectItem>
                          <SelectItem value="Mangalarga">Mangalarga</SelectItem>
                          <SelectItem value="Crioulo">Crioulo</SelectItem>
                          <SelectItem value="Árabe">Árabe</SelectItem>
                          <SelectItem value="Puro Sangue Inglês">Puro Sangue Inglês</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Alazão">Alazão</SelectItem>
                          <SelectItem value="Preto">Preto</SelectItem>
                          <SelectItem value="Baio">Baio</SelectItem>
                          <SelectItem value="Tordilho">Tordilho</SelectItem>
                          <SelectItem value="Ruano">Ruano</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gênero</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Macho" id="gender-male" />
                          <Label htmlFor="gender-male">Macho</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Fêmea" id="gender-female" />
                          <Label htmlFor="gender-female">Fêmea</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo - Potro">Ativo - Potro</SelectItem>
                        <SelectItem value="Ativo - Em doma">Ativo - Em doma</SelectItem>
                        <SelectItem value="Ativo - Domado">Ativo - Domado</SelectItem>
                        <SelectItem value="Ativo - Pronto para uso">Ativo - Pronto para uso</SelectItem>
                        <SelectItem value="Em treinamento - Em doma">Em treinamento - Em doma</SelectItem>
                        <SelectItem value="Em treinamento - Domado">Em treinamento - Domado</SelectItem>
                        <SelectItem value="Em descanso - Potro">Em descanso - Potro</SelectItem>
                        <SelectItem value="Em descanso - Domado">Em descanso - Domado</SelectItem>
                        <SelectItem value="Vendido - Potro">Vendido - Potro</SelectItem>
                        <SelectItem value="Vendido - Domado">Vendido - Domado</SelectItem>
                        <SelectItem value="Inseminado">Inseminado</SelectItem>
                        <SelectItem value="Morto">Morto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Salvar Cavalo</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoCavalos;
