
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Tipos de reprodução
export type MetodoReproducao = "TOURE" | "IATF" | "REPASSE";
export type StatusPrenhez = "PENDENTE" | "PRENHA" | "FALHADA" | "FINALIZADA";
export type TipoAnimal = "bovino" | "equino";

// Interface para o registro de reprodução
export interface ReproducaoAnimal {
  id: string;
  animalId: string;
  animalIdentificacao: string;
  animalNome: string;
  tipoAnimal: TipoAnimal;
  metodo: MetodoReproducao;
  dataInicio: Date;
  dataFim: Date | null;
  statusPrenhez: StatusPrenhez;
  destino: string;
  numeroProtocolo: string;
  ultrassons: UltrassomRegistro[];
  observacoes: string;
}

// Interface para os registros de ultrassom
export interface UltrassomRegistro {
  id: string;
  data: Date;
  numero: number; // 1º ou 2º ultrassom
  resultado: "POSITIVO" | "NEGATIVO";
  observacoes: string;
}

// Dados iniciais de exemplo
const initialReproducoes: ReproducaoAnimal[] = [
  {
    id: "1",
    animalId: "BG-101",
    animalIdentificacao: "BG-101",
    animalNome: "Estrela",
    tipoAnimal: "bovino",
    metodo: "IATF",
    dataInicio: new Date(2025, 3, 15),
    dataFim: null,
    statusPrenhez: "PENDENTE",
    destino: "Rebanho principal",
    numeroProtocolo: "R2023-001",
    ultrassons: [],
    observacoes: "Primeira tentativa de IATF"
  },
  {
    id: "2",
    animalId: "BG-103",
    animalIdentificacao: "BG-103",
    animalNome: "Luna",
    tipoAnimal: "bovino",
    metodo: "TOURE",
    dataInicio: new Date(2025, 2, 10),
    dataFim: null,
    statusPrenhez: "PRENHA",
    destino: "Rebanho principal",
    numeroProtocolo: "R2023-002",
    ultrassons: [
      {
        id: "U1",
        data: new Date(2025, 3, 10),
        numero: 1,
        resultado: "POSITIVO",
        observacoes: "Prenhez confirmada em primeiro exame"
      }
    ],
    observacoes: "Monta natural com touro Netuno"
  },
  {
    id: "3",
    animalId: "EQ-101",
    animalIdentificacao: "EQ-101",
    animalNome: "Vendaval",
    tipoAnimal: "equino",
    metodo: "REPASSE",
    dataInicio: new Date(2025, 2, 20),
    dataFim: null,
    statusPrenhez: "FALHADA",
    destino: "Repasse",
    numeroProtocolo: "R2023-003",
    ultrassons: [
      {
        id: "U2",
        data: new Date(2025, 3, 20),
        numero: 1,
        resultado: "NEGATIVO",
        observacoes: "Não confirmada prenhez, encaminhada para repasse"
      }
    ],
    observacoes: "Segunda tentativa após falha em IATF"
  },
];

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
