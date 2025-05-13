
import { useState } from "react";
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

export function useCattle() {
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

  const handleEditSuccess = (updatedAnimal: any = null) => {
    // Se temos um animal atualizado, atualizamos a lista
    // Se não, apenas fechamos o diálogo
    if (updatedAnimal) {
      setCattle(cattle.map(animal => 
        animal.id === updatedAnimal.id ? updatedAnimal : animal
      ));
    }
    setIsEditDialogOpen(false);
    toast({
      title: "Animal atualizado",
      description: `As informações do animal foram atualizadas.`
    });
  };

  return {
    cattle,
    setCattle,
    searchTerm,
    setSearchTerm,
    filteredCattle,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentCattle,
    setCurrentCattle,
    handleAddCattleSuccess,
    handleViewCattle,
    handleEditCattle,
    handleDeleteCattle,
    handleEditSuccess
  };
}
