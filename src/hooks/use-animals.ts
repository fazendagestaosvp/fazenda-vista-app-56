
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface Animal {
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

export const useAnimals = () => {
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

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
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

  return {
    animals,
    filteredAnimals,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentAnimal,
    handleViewAnimal,
    handleEditAnimal,
    handleDeleteAnimal,
    handleAddSuccess,
    handleEditSuccess,
    convertToCattleFormat
  };
};
