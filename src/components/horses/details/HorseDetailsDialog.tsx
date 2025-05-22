
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HorseInfoTabContent } from "./HorseInfoTabContent";
import { HorseLineageTabContent } from "./HorseLineageTabContent";
import { HorseHealthTabContent } from "./HorseHealthTabContent";

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
  if (!selectedHorse) return null;

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
            <HorseInfoTabContent selectedHorse={selectedHorse} />
          </TabsContent>

          <TabsContent value="lineage" className="space-y-4 pt-4">
            <HorseLineageTabContent 
              selectedHorse={selectedHorse} 
              onUpdateHorse={onUpdateHorse} 
            />
          </TabsContent>

          <TabsContent value="health" className="space-y-4 pt-4">
            <HorseHealthTabContent 
              selectedHorse={selectedHorse} 
              onUpdateHorse={onUpdateHorse} 
            />
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
