
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UiRole } from "@/types/user.types";

export const useUserRoleManagement = (user: any) => {
  const [currentUserRole, setCurrentUserRole] = useState<UiRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCurrentUserRole();
    } else {
      setCurrentUserRole(null);
      setRoleLoading(false);
    }
  }, [user]);

  const fetchCurrentUserRole = async () => {
    if (!user) return;

    try {
      setRoleLoading(true);
      
      console.log("Buscando role para usuário:", user.id);
      
      // Primeiro, tentar buscar na tabela user_roles
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('role, role_type')
        .eq('user_id', user.id)
        .single();

      if (userRoleError && userRoleError.code !== 'PGRST116') {
        console.error('Erro ao buscar role na tabela user_roles:', userRoleError);
      }

      let uiRole: UiRole = 'editor'; // Default

      if (userRoleData) {
        console.log("Role encontrado na tabela:", userRoleData);
        
        // Mapear baseado no campo 'role' da tabela user_roles
        // Fix: Proper mapping from database roles to UI roles
        const dbRole = userRoleData.role as string;
        switch (dbRole) {
          case 'admin':
            uiRole = 'admin';
            break;
          case 'viewer':
            uiRole = 'viewer';
            break;
          case 'user': // Database role "user" maps to UI role "editor"
            uiRole = 'editor';
            break;
          default:
            uiRole = 'editor';
            break;
        }
      } else {
        // Se não encontrou na tabela, usar a função RPC como fallback
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_role', {
          user_id: user.id
        });

        if (rpcError) {
          console.error('Erro ao buscar role via RPC:', rpcError);
        } else {
          console.log("Role via RPC:", rpcData);
          
          // Mapear os roles do banco para UiRole
          const dbRole = rpcData || 'EDITOR';
          
          switch (dbRole) {
            case 'ADM':
              uiRole = 'admin';
              break;
            case 'VISUALIZADOR':
              uiRole = 'viewer';
              break;
            case 'EDITOR':
            default:
              uiRole = 'editor';
              break;
          }
        }
      }

      console.log("Role final definido:", uiRole);
      setCurrentUserRole(uiRole);
    } catch (error) {
      console.error('Erro ao buscar role:', error);
      setCurrentUserRole('editor');
    } finally {
      setRoleLoading(false);
    }
  };
  
  // Use os role checks baseados no sistema atualizado
  const isAdmin = () => {
    const result = currentUserRole === "admin";
    console.log("isAdmin check:", currentUserRole, "->", result);
    return result;
  };
  
  const isViewer = () => currentUserRole === "viewer";
  const isEditor = () => currentUserRole === "editor";
  const canEdit = () => currentUserRole === "admin" || currentUserRole === "editor";
  
  const hasAccessLevel = (minimumLevel: UiRole) => {
    if (!currentUserRole) return false;
    
    if (minimumLevel === "admin") {
      return isAdmin();
    } else if (minimumLevel === "editor") {
      return isAdmin() || isEditor();
    } else {
      return true; // todos os usuários logados podem acessar páginas de nível "viewer"
    }
  };

  return {
    currentUserRole,
    roleLoading,
    isAdmin,
    isViewer,
    isEditor,
    canEdit,
    hasAccessLevel
  };
};
