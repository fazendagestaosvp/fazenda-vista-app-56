import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Tipos para o histórico de saúde
export interface HealthRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalType: string;
  type: string;
  procedure: string;
  date: Date;
  veterinarian: string;
  notes: string;
  status: string;
}

// Dados iniciais de exemplo (os mesmos da página HistoricoSaude.tsx)
const initialHealthRecords = [
  {
    id: "HR-101",
    animalId: "BG-101",
    animalName: "Estrela",
    animalType: "Gado",
    type: "Vacinação",
    procedure: "Febre Aftosa",
    date: new Date(2025, 4, 1),
    veterinarian: "Dr. Carlos Silva",
    notes: "Aplicação de rotina, sem complicações.",
    status: "Concluído"
  },
  {
    id: "HR-102",
    animalId: "HC-101",
    animalName: "Ventania",
    animalType: "Cavalo",
    type: "Exame",
    procedure: "Exame de Sangue",
    date: new Date(2025, 3, 25),
    veterinarian: "Dra. Ana Oliveira",
    notes: "Resultados normais.",
    status: "Concluído"
  },
  {
    id: "HR-103",
    animalId: "BG-103",
    animalName: "Luna",
    animalType: "Gado",
    type: "Tratamento",
    procedure: "Antibióticos",
    date: new Date(2025, 3, 28),
    veterinarian: "Dr. Carlos Silva",
    notes: "Infecção leve. Tratar por 7 dias.",
    status: "Em andamento"
  },
  {
    id: "HR-104",
    animalId: "HC-103",
    animalName: "Lua Cheia",
    animalType: "Cavalo",
    type: "Vacinação",
    procedure: "Tétano",
    date: new Date(2025, 4, 5),
    veterinarian: "Dra. Ana Oliveira",
    notes: "Vacinação anual.",
    status: "Agendado"
  },
  {
    id: "HR-105",
    animalId: "BG-102",
    animalName: "Trovão",
    animalType: "Gado",
    type: "Consulta",
    procedure: "Avaliação Geral",
    date: new Date(2025, 4, 2),
    veterinarian: "Dr. Carlos Silva",
    notes: "Animal em boas condições.",
    status: "Concluído"
  },
];

export const useHealthHistory = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalTypeFilter, setAnimalTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);

  // Filtragem por termo de busca, tipo de animal e status
  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.procedure.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAnimalType = animalTypeFilter === "all" || record.animalType === animalTypeFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesAnimalType && matchesStatus;
  });

  // Manipuladores de eventos
  const handleViewRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de saúde?")) {
      setHealthRecords(healthRecords.filter(record => record.id !== recordId));
      toast({
        title: "Registro excluído",
        description: `O registro de saúde foi excluído com sucesso.`
      });
    }
  };

  const handleAddSuccess = (newRecord: HealthRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: "Registro adicionado",
      description: `Novo registro de saúde adicionado com sucesso.`
    });
  };

  const handleEditSuccess = (updatedRecord: HealthRecord) => {
    setHealthRecords(healthRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Registro atualizado",
      description: `As informações do registro foram atualizadas com sucesso.`
    });
  };

  // Contadores para estatísticas
  const vaccineCount = healthRecords.filter(record => record.type === "Vacinação").length;
  const examCount = healthRecords.filter(record => record.type === "Exame").length;
  const treatmentCount = healthRecords.filter(record => record.type === "Tratamento").length;
  const consultationCount = healthRecords.filter(record => record.type === "Consulta").length;

  const completedCount = healthRecords.filter(record => record.status === "Concluído").length;
  const inProgressCount = healthRecords.filter(record => record.status === "Em andamento").length;
  const scheduledCount = healthRecords.filter(record => record.status === "Agendado").length;

  // Eventos futuros
  const today = new Date();
  const upcomingEvents = healthRecords
    .filter(record => record.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return {
    healthRecords,
    filteredRecords,
    searchTerm,
    setSearchTerm,
    animalTypeFilter,
    setAnimalTypeFilter,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentRecord,
    handleViewRecord,
    handleEditRecord,
    handleDeleteRecord,
    handleAddSuccess,
    handleEditSuccess,
    vaccineCount,
    examCount,
    treatmentCount,
    consultationCount,
    completedCount,
    inProgressCount,
    scheduledCount,
    upcomingEvents
  };
};
