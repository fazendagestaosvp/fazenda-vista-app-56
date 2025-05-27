
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCalendar, EventType } from "@/hooks/use-calendar";
import { Trash2 } from "lucide-react";

const CalendarioPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { events, loading, addEvent, deleteEvent } = useCalendar();
  
  const [newEvent, setNewEvent] = useState<{
    title: string;
    type: EventType;
    date: Date | undefined;
  }>({
    title: "",
    type: "other",
    date: new Date(),
  });

  // Get events for the selected date
  const selectedDateEvents = date
    ? events.filter(
        (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      )
    : [];

  // Get upcoming events
  const upcomingEvents = [...events]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter((event) => event.date >= new Date())
    .slice(0, 5);

  // Handle form submission for new events
  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.date) {
      const result = await addEvent({
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type,
      });

      if (result?.success) {
        setNewEvent({
          title: "",
          type: "other",
          date: new Date(),
        });
      }
    }
  };

  // Get the color for an event type
  const getEventColor = (type: EventType) => {
    switch (type) {
      case "health":
        return "bg-red-500";
      case "maintenance":
        return "bg-blue-500";
      case "supply":
        return "bg-amber-500";
      case "harvest":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "health":
        return "Saúde";
      case "maintenance":
        return "Manutenção";
      case "supply":
        return "Suprimentos";
      case "harvest":
        return "Colheita";
      default:
        return "Outro";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Calendário</h1>
        <p className="text-gray-500">Gerencie todos os eventos da fazenda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-farm">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-farm">
              {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {getEventTypeLabel(event.type)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum evento para esta data.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-farm">Adicionar Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Nome do evento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value as EventType })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Saúde</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="supply">Suprimentos</SelectItem>
                    <SelectItem value="harvest">Colheita</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">Data</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date ? format(newEvent.date, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setNewEvent({ ...newEvent, date });
                  }}
                />
              </div>

              <Button 
                className="w-full bg-farm hover:bg-farm-dark" 
                onClick={handleAddEvent}
                disabled={loading || !newEvent.title || !newEvent.date}
              >
                {loading ? "Adicionando..." : "Adicionar Evento"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-farm">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {format(event.date, "d MMM yyyy", { locale: ptBR })} - {getEventTypeLabel(event.type)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum evento próximo.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarioPage;
