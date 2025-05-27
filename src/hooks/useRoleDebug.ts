
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthContext";

export const useRoleDebug = () => {
  const { user } = useAuth();
  const [dbRoleData, setDbRoleData] = useState<any>(null);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  const checkRoleInDatabase = async () => {
    if (!user) {
      console.log("❌ useRoleDebug: Usuário não disponível");
      return;
    }

    console.log("🔍 useRoleDebug: Verificando role no banco para:", user.id);
    
    try {
      // Verificar na tabela user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      // Também verificar se o usuário existe na tabela auth.users através de uma função
      const { data: userEmails, error: emailError } = await supabase.rpc('get_user_emails', { 
        user_ids: [user.id] 
      });

      const debugResult = {
        userId: user.id,
        userEmail: user.email,
        roleData,
        roleError,
        userEmails,
        emailError,
        timestamp: new Date().toISOString()
      };

      console.log("🔍 useRoleDebug - Resultado completo:", debugResult);
      setDbRoleData(debugResult);
      setLastCheck(new Date().toISOString());

      return debugResult;
    } catch (error) {
      console.error("❌ useRoleDebug - Erro crítico:", error);
      const errorResult = {
        error: error,
        timestamp: new Date().toISOString()
      };
      setDbRoleData(errorResult);
      return errorResult;
    }
  };

  useEffect(() => {
    if (user) {
      checkRoleInDatabase();
    }
  }, [user]);

  return {
    dbRoleData,
    lastCheck,
    checkRoleInDatabase
  };
};
