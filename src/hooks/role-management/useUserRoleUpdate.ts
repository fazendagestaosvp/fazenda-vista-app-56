
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRoleType } from "./types";

export const useUserRoleUpdate = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateUserRole = async (userId: string, newRole: UserRoleType): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Remover role atual
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Mapear para o enum do banco
      let dbRole;
      switch (newRole) {
        case 'ADM':
          dbRole = 'admin';
          break;
        case 'VISUALIZADOR':
          dbRole = 'viewer';
          break;
        default:
          dbRole = 'editor';
      }

      // Inserir novo role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: dbRole,
          role_type: newRole
        });

      if (insertError) throw insertError;

      toast({
        title: "Role atualizado",
        description: `Usuário promovido para ${newRole} com sucesso!`,
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: "Erro ao atualizar role",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateUserRole
  };
};
