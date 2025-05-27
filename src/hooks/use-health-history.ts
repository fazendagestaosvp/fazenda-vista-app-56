
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      fetchHealthHistory();
    }
  }, [user]);

  const fetchHealthHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: healthData, error } = await supabase
        .from('health_history')
        .select(`
          *,
          animals:animal_id (
            name,
            species,
            identification
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching health history:', error);
        return;
      }

      const formattedRecords: HealthRecord[] = (healthData || []).map((record: any) => ({
        id: record.id,
        animalId: record.animals?.identification || record.animal_id,
        animalName: record.animals?.name || 'Animal não encontrado',
        animalType: record.animals?.species || 'Desconhecido',
        type: record.type,
        procedure: record.description || record.type,
        date: new Date(record.date),
        veterinarian: record.veterinarian || 'Não informado',
        status: record.notes?.includes('concluído') ? 'Concluído' : 
                record.notes?.includes('agendado') ? 'Agendado' : 'Em andamento',
        notes: record.notes || ''
      }));

      setRecords(formattedRecords);
    } catch (error) {
      console.error('Error fetching health history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHealthRecord = async (newRecord: Omit<HealthRecord, 'id'>) => {
    if (!user) return;

    try {
      // Find the animal by identification
      const { data: animals, error: animalError } = await supabase
        .from('animals')
        .select('id')
        .eq('identification', newRecord.animalId)
        .eq('user_id', user.id)
        .single();

      if (animalError || !animals) {
        throw new Error('Animal não encontrado');
      }

      const { error } = await supabase
        .from('health_history')
        .insert({
          animal_id: animals.id,
          user_id: user.id,
          date: newRecord.date.toISOString().split('T')[0],
          type: newRecord.type,
          description: newRecord.procedure,
          veterinarian: newRecord.veterinarian,
          notes: newRecord.notes || '',
        });

      if (error) throw error;

      await fetchHealthHistory();
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
