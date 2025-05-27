
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthContext";

export type UserRoleType = "ADM" | "EDITOR" | "VISUALIZADOR";

export const useUserRole = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCurrentUserRole();
    } else {
      setCurrentUserRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchCurrentUserRole = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Usar a função do banco para obter o role
      const { data, error } = await supabase.rpc('get_user_role', {
        user_id: user.id
      });

      if (error) {
        console.error('Erro ao buscar role do usuário:', error);
        setCurrentUserRole('EDITOR'); // Default
        return;
      }

      setCurrentUserRole(data as UserRoleType || 'EDITOR');
    } catch (error) {
      console.error('Erro ao buscar role:', error);
      setCurrentUserRole('EDITOR');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => currentUserRole === 'ADM';
  const isEditor = () => currentUserRole === 'EDITOR';
  const isViewer = () => currentUserRole === 'VISUALIZADOR';

  return {
    currentUserRole,
    loading,
    isAdmin,
    isEditor,
    isViewer,
    refreshRole: fetchCurrentUserRole
  };
};
