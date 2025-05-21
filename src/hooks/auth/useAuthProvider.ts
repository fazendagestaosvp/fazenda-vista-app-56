
// Update import paths to use the refactored services
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UiRole } from "@/types/user.types";
import { getCurrentUser, getSessionUser } from "@/services/user";
import { Session } from "@supabase/supabase-js";

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<UiRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao obter sessão:", error);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sessionUser = await getSessionUser();
        setUser(sessionUser);
        setUserRole(sessionUser?.role || null);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  return {
    session,
    user,
    userRole,
    loading,
    setLoading
  };
};
