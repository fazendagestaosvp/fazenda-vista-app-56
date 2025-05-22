
import { useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { HorseImageUploader } from "./HorseImageUploader";

interface HorseLineageTabContentProps {
  selectedHorse: any;
  onUpdateHorse: (updatedHorse: any) => void;
}

export function HorseLineageTabContent({ 
  selectedHorse, 
  onUpdateHorse 
}: HorseLineageTabContentProps) {
  const { toast } = useToast();

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
        
        // Notify user
        toast({
          title: `Imagem ${type === 'sire' ? 'do pai' : 'da mãe'} adicionada`,
          description: "A imagem foi salva com sucesso."
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (type: 'sire' | 'dam') => {
    if (!selectedHorse) return;
    
    // Create updated horse with image removed
    const updatedHorse = {
      ...selectedHorse,
      [type === 'sire' ? 'sireImage' : 'damImage']: ""
    };
    
    // Update horse data
    onUpdateHorse(updatedHorse);
    
    // Notify user
    toast({
      title: `Imagem ${type === 'sire' ? 'do pai' : 'da mãe'} removida`,
      description: "A imagem foi removida com sucesso."
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Sire (Father) */}
      <Card>
        <CardHeader>
          <CardTitle>Pai (Garanhão)</CardTitle>
          <CardDescription>{selectedHorse.sire}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <HorseImageUploader
            imageUrl={selectedHorse.sireImage}
            onUpload={(e) => handleImageUpload(e, 'sire')}
            onRemove={() => handleRemoveImage('sire')}
            inputId="sire-upload"
            placeholder="Adicionar foto do pai"
          />
        </CardContent>
      </Card>

      {/* Dam (Mother) */}
      <Card>
        <CardHeader>
          <CardTitle>Mãe (Égua)</CardTitle>
          <CardDescription>{selectedHorse.dam}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <HorseImageUploader
            imageUrl={selectedHorse.damImage}
            onUpload={(e) => handleImageUpload(e, 'dam')}
            onRemove={() => handleRemoveImage('dam')}
            inputId="dam-upload"
            placeholder="Adicionar foto da mãe"
          />
        </CardContent>
      </Card>
    </div>
  );
}
