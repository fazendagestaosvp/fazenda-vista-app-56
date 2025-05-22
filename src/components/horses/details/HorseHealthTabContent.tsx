
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Syringe, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { VaccinationItem } from "./VaccinationItem";

interface HorseHealthTabContentProps {
  selectedHorse: any;
  onUpdateHorse: (updatedHorse: any) => void;
}

export function HorseHealthTabContent({ 
  selectedHorse, 
  onUpdateHorse 
}: HorseHealthTabContentProps) {
  const { toast } = useToast();
  const [newVaccineName, setNewVaccineName] = useState("");

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
    <Card>
      <CardHeader>
        <CardTitle>Vacinas</CardTitle>
        <CardDescription>Histórico de vacinação do animal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedHorse.vaccinations.map((vacc: any) => (
              <VaccinationItem
                key={vacc.name}
                vaccination={vacc}
                onToggle={() => handleToggleVaccination(vacc.name)}
              />
            ))}

            {selectedHorse.customVaccinations.length > 0 && (
              <div className="md:col-span-2 mt-4">
                <h4 className="text-sm font-semibold mb-2">Outras vacinas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedHorse.customVaccinations.map((vacc: any) => (
                    <VaccinationItem
                      key={vacc.name}
                      vaccination={vacc}
                      onToggle={() => handleToggleVaccination(vacc.name, true)}
                    />
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
  );
}
