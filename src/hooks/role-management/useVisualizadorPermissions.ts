
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVisualizadorPermissions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const manageVisualizadorPermissions = async (
    visualizadorId: string, 
    contaIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Remover permissões existentes
      const { error: deleteError } = await supabase
        .from('visualizadores_permitidos')
        .delete()
        .eq('visualizador_id', visualizadorId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (contaIds.length > 0) {
        const permissionsData = contaIds.map(contaId => ({
          visualizador_id: visualizadorId,
          conta_id: contaId
        }));

        const { error: insertError } = await supabase
          .from('visualizadores_permitidos')
          .insert(permissionsData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Permissões atualizadas",
        description: "Permissões do visualizador foram atualizadas com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao gerenciar permissões:', error);
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchVisualizadorPermissions = async (visualizadorId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('visualizadores_permitidos')
        .select('conta_id')
        .eq('visualizador_id', visualizadorId);

      if (error) throw error;
      return data.map(item => item.conta_id) || [];
    } catch (error: any) {
      console.error('Erro ao buscar permissões:', error);
      return [];
    }
  };

  return {
    loading,
    manageVisualizadorPermissions,
    fetchVisualizadorPermissions
  };
};
