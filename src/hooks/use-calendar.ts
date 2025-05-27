
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/use-toast";

export type EventType = "health" | "maintenance" | "supply" | "harvest" | "other";

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  user_id?: string;
}

interface DatabaseEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;

      const formattedEvents: Event[] = (data as DatabaseEvent[]).map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date),
        type: event.type as EventType,
        user_id: event.user_id
      }));

      setEvents(formattedEvents);
    } catch (error: any) {
      console.error("Error loading events:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, "id" | "user_id">) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          title: event.title,
          date: event.date.toISOString(),
          type: event.type,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: Event = {
        id: (data as DatabaseEvent).id,
        title: (data as DatabaseEvent).title,
        date: new Date((data as DatabaseEvent).date),
        type: (data as DatabaseEvent).type as EventType,
        user_id: (data as DatabaseEvent).user_id
      };

      setEvents(prev => [...prev, newEvent].sort((a, b) => a.date.getTime() - b.date.getTime()));

      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado com sucesso ao calendário.",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar evento",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));

      toast({
        title: "Evento removido",
        description: "O evento foi removido do calendário.",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao remover evento",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  return {
    events,
    loading,
    addEvent,
    deleteEvent,
    loadEvents,
  };
};
