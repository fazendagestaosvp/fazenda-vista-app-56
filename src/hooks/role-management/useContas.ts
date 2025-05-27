
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContaData } from "./types";

export const useContas = () => {
  const { toast } = useToast();

  const fetchContas = async (): Promise<ContaData[]> => {
    try {
      const { data, error } = await supabase
        .from('contas')
        .select('id, nome_conta, proprietario_id')
        .order('nome_conta');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erro ao buscar contas:', error);
      toast({
        title: "Erro ao carregar contas",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    fetchContas
  };
};
