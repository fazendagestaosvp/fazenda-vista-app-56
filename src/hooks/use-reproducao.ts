
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ReproducaoAnimal, TipoAnimal } from "@/types/reproducao.types";
import { initialReproducoes } from "@/utils/reproducao.utils";

// Re-export types for convenience
export * from "@/types/reproducao.types";

export const useReproducao = () => {
  const [reproducoes, setReproducoes] = useState<ReproducaoAnimal[]>(initialReproducoes);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalTipo, setAnimalTipo] = useState<"todos" | TipoAnimal>("todos");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUltrassomDialogOpen, setIsUltrassomDialogOpen] = useState(false);
  const [currentReproducao, setCurrentReproducao] = useState<ReproducaoAnimal | null>(null);

  // Filtragem por termo de busca e tipo de animal
  const filteredReproducoes = reproducoes.filter(reproducao => {
    const matchesSearch = 
      reproducao.animalIdentificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reproducao.animalNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reproducao.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = animalTipo === "todos" || reproducao.tipoAnimal === animalTipo;
    
    return matchesSearch && matchesType;
  });

  // Manipuladores de eventos
  const handleViewReproducao = (reproducao: ReproducaoAnimal) => {
    setCurrentReproducao(reproducao);
    setIsViewDialogOpen(true);
  };

  const handleEditReproducao = (reproducao: ReproducaoAnimal) => {
    setCurrentReproducao(reproducao);
    setIsEditDialogOpen(true);
  };

  const handleUltrassom = (reproducao: ReproducaoAnimal) => {
    setCurrentReproducao(reproducao);
    setIsUltrassomDialogOpen(true);
  };

  const handleDeleteReproducao = (reproducaoId: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de reprodução?")) {
      setReproducoes(reproducoes.filter(r => r.id !== reproducaoId));
      toast({
        title: "Registro excluído",
        description: `O registro de reprodução foi excluído com sucesso.`
      });
    }
  };

  const handleAddSuccess = (novoRegistro: ReproducaoAnimal) => {
    setReproducoes([...reproducoes, novoRegistro]);
    setIsAddDialogOpen(false);
    toast({
      title: "Registro adicionado",
      description: `Novo registro de reprodução adicionado com sucesso.`
    });
  };

  const handleEditSuccess = (registroAtualizado: ReproducaoAnimal) => {
    setReproducoes(reproducoes.map(r => 
      r.id === registroAtualizado.id ? registroAtualizado : r
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Registro atualizado",
      description: `As informações do registro foram atualizadas com sucesso.`
    });
  };

  const handleUltrassomSuccess = (registroAtualizado: ReproducaoAnimal) => {
    setReproducoes(reproducoes.map(r => 
      r.id === registroAtualizado.id ? registroAtualizado : r
    ));
    setIsUltrassomDialogOpen(false);
    toast({
      title: "Ultrassom registrado",
      description: `O exame de ultrassom foi registrado com sucesso.`
    });
  };

  return {
    reproducoes,
    filteredReproducoes,
    searchTerm,
    setSearchTerm,
    animalTipo,
    setAnimalTipo,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isUltrassomDialogOpen,
    setIsUltrassomDialogOpen,
    currentReproducao,
    handleViewReproducao,
    handleEditReproducao,
    handleUltrassom,
    handleDeleteReproducao,
    handleAddSuccess,
    handleEditSuccess,
    handleUltrassomSuccess
  };
};
