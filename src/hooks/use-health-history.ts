
import { useState, useEffect } from "react";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

export interface HealthRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalType: string;
  type: string;
  procedure: string;
  date: Date;
  veterinarian: string;
  status: string;
  notes?: string;
}

export const useHealthHistory = () => {
  const { user } = useSimpleAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalTypeFilter, setAnimalTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Mock data por enquanto, até termos a tabela health_history no Supabase
      const mockRecords: HealthRecord[] = [
        {
          id: "1",
          animalId: "BG-001",
          animalName: "Estrela",
          animalType: "Gado",
          type: "Vacinação",
          procedure: "Febre Aftosa",
          date: new Date(2024, 0, 15),
          veterinarian: "Dr. Carlos Silva",
          status: "Concluído",
          notes: "Vacinação aplicada sem intercorrências"
        },
        {
          id: "2",
          animalId: "CV-001",
          animalName: "Thunder",
          animalType: "Cavalo",
          type: "Exame",
          procedure: "Exame de rotina",
          date: new Date(2024, 1, 20),
          veterinarian: "Dra. Ana Costa",
          status: "Agendado",
          notes: "Exame geral de saúde"
        }
      ];
      
      setRecords(mockRecords);
      setLoading(false);
    }
  }, [user]);

  const addHealthRecord = async (newRecord: Omit<HealthRecord, 'id'>) => {
    if (!user) return;

    try {
      const recordWithId: HealthRecord = {
        ...newRecord,
        id: `HR-${Date.now()}`
      };

      setRecords(prev => [...prev, recordWithId]);
    } catch (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.veterinarian.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAnimalType = animalTypeFilter === "all" || record.animalType === animalTypeFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesAnimalType && matchesStatus;
  });

  const handleAddSuccess = (record: HealthRecord) => {
    setIsAddDialogOpen(false);
    addHealthRecord(record).catch(console.error);
  };

  // Estatísticas
  const vaccineCount = records.filter(r => r.type.toLowerCase().includes('vacina')).length;
  const examCount = records.filter(r => r.type.toLowerCase().includes('exame')).length;
  const treatmentCount = records.filter(r => r.type.toLowerCase().includes('tratamento')).length;
  const consultationCount = records.filter(r => r.type.toLowerCase().includes('consulta')).length;

  const completedCount = records.filter(r => r.status === 'Concluído').length;
  const inProgressCount = records.filter(r => r.status === 'Em andamento').length;
  const scheduledCount = records.filter(r => r.status === 'Agendado').length;

  const upcomingEvents = records
    .filter(r => r.status === 'Agendado' && r.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return {
    records,
    filteredRecords,
    searchTerm,
    setSearchTerm,
    animalTypeFilter,
    setAnimalTypeFilter,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddSuccess,
    loading,
    vaccineCount,
    examCount,
    treatmentCount,
    consultationCount,
    completedCount,
    inProgressCount,
    scheduledCount,
    upcomingEvents,
  };
};
