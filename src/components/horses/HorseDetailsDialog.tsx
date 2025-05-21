
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Camera, Upload, Check, Syringe } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HorseStatusBadge } from "./HorseStatusBadge";

interface HorseDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHorse: any;
  onUpdateHorse: (updatedHorse: any) => void;
}

export function HorseDetailsDialog({ 
  isOpen, 
  onOpenChange, 
  selectedHorse,
  onUpdateHorse
}: HorseDetailsDialogProps) {
  const { toast } = useToast();
  const [newVaccineName, setNewVaccineName] = useState("");

  if (!selectedHorse) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'sire' | 'dam') => {
    if (event.target.files && event.target.files[0] && selectedHorse) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // Update the horse data
        const updatedHorse = {
          ...selectedHorse,
          [type === 'sire' ? 'sireImage' : 'damImage']: imageUrl
        };
        
        onUpdateHorse(updatedHorse);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVaccination = (vaccinationName: string, isCustom: boolean = false) => {
    if (!selectedHorse) return;
    
    const updatedHorse = { ...selectedHorse };
    
    if (isCustom) {
      updatedHorse.customVaccinations = updatedHorse.customVaccinations.map((vacc: any) => {
        if (vacc.name === vaccinationName) {
          return { ...vacc, applied: !vacc.applied, date: !vacc.applied ? new Date() : vacc.date };
        }
        return vacc;
      });
    } else {
      updatedHorse.vaccinations = updatedHorse.vaccinations.map((vacc: any) => {
        if (vacc.name === vaccinationName) {
          return { ...vacc, applied: !vacc.applied, date: !vacc.applied ? new Date() : vacc.date };
        }
        return vacc;
      });
    }
    
    onUpdateHorse(updatedHorse);
    
    toast({
      title: "Vacinação atualizada",
      description: "O status da vacinação foi atualizado com sucesso.",
    });
  };

  const handleAddCustomVaccine = () => {
    if (!selectedHorse || !newVaccineName.trim()) return;
    
    // Check if vaccine already exists
    const alreadyExists = selectedHorse.vaccinations.some((v: any) => v.name.toLowerCase() === newVaccineName.toLowerCase()) || 
                          selectedHorse.customVaccinations.some((v: any) => v.name.toLowerCase() === newVaccineName.toLowerCase());
    
    if (alreadyExists) {
      toast({
        title: "Erro",
        description: "Esta vacina já existe na lista.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedHorse = { 
      ...selectedHorse,
      customVaccinations: [
        ...selectedHorse.customVaccinations,
        { name: newVaccineName, date: null, applied: false }
      ]
    };
    
    onUpdateHorse(updatedHorse);
    
    toast({
      title: "Vacina adicionada",
      description: `A vacina ${newVaccineName} foi adicionada com sucesso.`
    });
    
    setNewVaccineName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
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
                <p className="text-sm mt-1"><HorseStatusBadge status={selectedHorse.status} /></p>
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
                    {selectedHorse.vaccinations.map((vacc: any) => (
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
                          {selectedHorse.customVaccinations.map((vacc: any) => (
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
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
