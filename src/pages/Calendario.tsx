
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const mockEvents = [
  { id: "1", title: "Vacinação do Rebanho", date: new Date(2025, 4, 10), type: "health" },
  { id: "2", title: "Manutenção de Cercas", date: new Date(2025, 4, 15), type: "maintenance" },
  { id: "3", title: "Visita Veterinária", date: new Date(2025, 4, 20), type: "health" },
  { id: "4", title: "Entrega de Ração", date: new Date(2025, 4, 8), type: "supply" },
  { id: "5", title: "Colheita de Milho", date: new Date(2025, 4, 25), type: "harvest" },
];

interface Event {
  id: string;
  title: string;
  date: Date;
  type: "health" | "maintenance" | "supply" | "harvest" | "other";
}

const eventTypeColors = {
  health: "bg-blue-500",
  maintenance: "bg-amber-500",
  supply: "bg-green-500",
  harvest: "bg-purple-500",
  other: "bg-gray-500",
};

const eventTypeLabels = {
  health: "Saúde Animal",
  maintenance: "Manutenção",
  supply: "Suprimentos",
  harvest: "Colheita",
  other: "Outros",
};

const CalendarioPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: "",
      type: "health" as Event["type"],
      date: selectedDay || new Date()
    }
  });
  
  const handleMonthChange = (increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + increment);
    setDate(newDate);
  };

  // Filter events for selected day
  const selectedDayEvents = selectedDay 
    ? events.filter(event => 
        event.date.getDate() === selectedDay.getDate() &&
        event.date.getMonth() === selectedDay.getMonth() &&
        event.date.getFullYear() === selectedDay.getFullYear()
      )
    : [];
  
  // Function to check if a day has events
  const hasDayEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const handleAddEvent = (data: { title: string; type: Event["type"]; date: Date }) => {
    const newEvent: Event = {
      id: `${Date.now()}`,
      title: data.title,
      date: selectedDay || new Date(),
      type: data.type
    };
    
    setEvents([...events, newEvent]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Evento adicionado",
      description: `${newEvent.title} foi adicionado ao calendário.`
    });
  };
  
  const openEventDialog = () => {
    form.setValue("date", selectedDay || new Date());
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Calendário</h1>
        <p className="text-gray-500">Gerencie os eventos e atividades da fazenda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-farm">Calendário de Eventos</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">
                  {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                month={date}
                onMonthChange={setDate}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasEvent: events.map(event => event.date),
                }}
                modifiersClassNames={{
                  hasEvent: "font-bold",
                }}
              />
              <div className="mt-6 flex justify-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-farm hover:bg-farm-dark text-white flex items-center gap-2"
                      onClick={openEventDialog}
                    >
                      <Plus size={16} />
                      Adicionar Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Evento</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleAddEvent)}>
                      <div className="grid gap-4 py-4">
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input
                              {...form.register("title", { required: true })}
                              placeholder="Nome do evento"
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <div className="text-sm text-gray-500">
                            {selectedDay ? format(selectedDay, "dd/MM/yyyy") : "Selecione uma data no calendário"}
                          </div>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select
                            defaultValue="health"
                            onValueChange={(value) => form.setValue("type", value as Event["type"])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="health">Saúde Animal</SelectItem>
                              <SelectItem value="maintenance">Manutenção</SelectItem>
                              <SelectItem value="supply">Suprimentos</SelectItem>
                              <SelectItem value="harvest">Colheita</SelectItem>
                              <SelectItem value="other">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-farm hover:bg-farm-dark">
                          Salvar Evento
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">
                Eventos do Dia
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {selectedDay?.toLocaleDateString('pt-BR')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                      <div className={`w-3 h-3 rounded-full mt-1 ${eventTypeColors[event.type]}`} />
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            {event.date.toLocaleDateString('pt-BR')}
                          </div>
                          <div className="mt-1 text-xs">{eventTypeLabels[event.type]}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedDay 
                    ? "Nenhum evento para este dia" 
                    : "Selecione um dia para ver os eventos"
                  }
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-farm">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${eventTypeColors[event.type]}`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.date.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;
