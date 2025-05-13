
import { useState, useEffect } from "react";
import { useAuth } from "./useAuthContext";
import { toast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  user_id?: string;
}

export const useAnimals = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Animal | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  
  const { user } = useAuth();

  // Carregar animais do Supabase
  useEffect(() => {
    const fetchAnimals = async () => {
      if (!user) {
        setAnimals([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('animals')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Converter para o formato esperado pela aplicação
        if (data) {
          const formattedAnimals: Animal[] = data.map(animal => ({
            id: animal.id,
            numero: animal.name || "",
            identificacao: animal.identification || "",
            sexo: (animal.gender === "Macho" ? "M" : "F") as "M" | "F",
            raca: animal.breed || "",
            dataNascimento: formatDateString(animal.birth_date),
            pesoKg: animal.weight || 0,
            status: (animal.status as "Ativo" | "Vendido" | "Óbito") || "Ativo",
            ultimaVacinacao: formatDateString(new Date().toISOString()),
            user_id: animal.user_id
          }));
          
          setAnimals(formattedAnimals);
        }
      } catch (error: any) {
        console.error("Erro ao carregar animais:", error.message);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar a lista de animais.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimals();
  }, [user]);

  const formatDateString = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

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

  const handleDeleteAnimal = async (animalId: string) => {
    if (!user) return;
    
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      try {
        const { error } = await supabase
          .from('animals')
          .delete()
          .eq('id', animalId);
        
        if (error) throw error;
        
        setAnimals(animals.filter(animal => animal.id !== animalId));
        toast({
          title: "Animal excluído",
          description: `O animal foi removido com sucesso.`
        });
      } catch (error: any) {
        console.error("Erro ao excluir animal:", error.message);
        toast({
          title: "Erro ao excluir animal",
          description: error.message || "Não foi possível excluir o animal.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddSuccess = async (newAnimal: any) => {
    if (!user) return;
    
    try {
      // Preparar os dados para inserção
      const animalData = {
        user_id: user.id,
        name: newAnimal.name,
        species: "Bovino", // Default value
        breed: newAnimal.type,
        birth_date: new Date().toISOString(), // Default to today
        weight: newAnimal.weight,
        status: newAnimal.status,
        gender: newAnimal.gender === "Macho" ? "Macho" : "Fêmea",
        identification: newAnimal.id
      };
      
      const { data, error } = await supabase
        .from('animals')
        .insert(animalData)
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const formattedAnimal: Animal = {
          id: data[0].id,
          numero: data[0].name || "",
          identificacao: data[0].identification || "",
          sexo: (data[0].gender === "Macho" ? "M" : "F") as "M" | "F",
          raca: data[0].breed || "",
          dataNascimento: formatDateString(data[0].birth_date),
          pesoKg: data[0].weight || 0,
          status: (data[0].status as "Ativo" | "Vendido" | "Óbito") || "Ativo",
          ultimaVacinacao: formatDateString(new Date().toISOString()),
          user_id: data[0].user_id
        };
        
        setAnimals([...animals, formattedAnimal]);
      }
      
      setIsAddDialogOpen(false);
      toast({
        title: "Animal adicionado",
        description: "O animal foi adicionado com sucesso."
      });
    } catch (error: any) {
      console.error("Erro ao adicionar animal:", error.message);
      toast({
        title: "Erro ao adicionar animal",
        description: error.message || "Não foi possível adicionar o animal.",
        variant: "destructive"
      });
    }
  };

  const handleEditSuccess = async (updatedAnimal: any) => {
    if (!user || !currentAnimal) return;
    
    try {
      const animalData = {
        name: updatedAnimal.name,
        breed: updatedAnimal.type,
        weight: updatedAnimal.weight,
        status: updatedAnimal.status,
        gender: updatedAnimal.gender === "Macho" ? "Macho" : "Fêmea",
        identification: updatedAnimal.id
      };
      
      const { error } = await supabase
        .from('animals')
        .update(animalData)
        .eq('id', currentAnimal.id);
      
      if (error) throw error;
      
      // Atualizar o estado local
      const newAnimal: Animal = {
        ...currentAnimal,
        numero: updatedAnimal.name,
        identificacao: updatedAnimal.id,
        sexo: updatedAnimal.gender === "Macho" ? "M" : "F",
        raca: updatedAnimal.type,
        pesoKg: updatedAnimal.weight,
        status: updatedAnimal.status as "Ativo" | "Vendido" | "Óbito",
      };
      
      setAnimals(animals.map(animal => 
        animal.id === currentAnimal.id ? newAnimal : animal
      ));
      
      setIsEditDialogOpen(false);
      toast({
        title: "Animal atualizado",
        description: "As informações do animal foram atualizadas."
      });
    } catch (error: any) {
      console.error("Erro ao atualizar animal:", error.message);
      toast({
        title: "Erro ao atualizar animal",
        description: error.message || "Não foi possível atualizar o animal.",
        variant: "destructive"
      });
    }
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
    loading,
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
