
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DbRole, UiRole, dbToUiRole } from "@/types/user.types";

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UiRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Inicializar a sessão e configurar o listener de mudanças de autenticação
  useEffect(() => {
    // Configurar o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar a função do usuário quando houver uma sessão
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Verificar se já existe uma sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para buscar a função do usuário (admin, user ou viewer)
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Buscando função do usuário:", userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar função do usuário:", error);
        return;
      }

      // Convert DB role to UI role
      const dbRole = data.role as DbRole;
      setUserRole(dbToUiRole(dbRole));
      
    } catch (error) {
      console.error("Erro ao buscar função do usuário:", error);
    }
  };

  return {
    session,
    user,
    userRole,
    loading,
    setLoading
  };
};
