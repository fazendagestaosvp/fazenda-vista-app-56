
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  email: boolean;
  reminders: boolean;
  healthAlerts: boolean;
  productionReports: boolean;
  systemUpdates: boolean;
}

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    reminders: true,
    healthAlerts: true,
    productionReports: false,
    systemUpdates: true,
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("settings")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error loading settings:", error);
        return;
      }

      if (data?.settings) {
        setSettings(data.settings as unknown as NotificationSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          settings: newSettings as any,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSettings(newSettings);
      toast({
        title: "Notificações atualizadas",
        description: "Suas preferências de notificação foram salvas.",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    saveSettings,
    loading,
  };
};
