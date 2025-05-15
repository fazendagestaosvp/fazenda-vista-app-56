{/* Desenvolvido por JPDev */}
<div className="p-3 border-t">
  <p className="text-xs text-gray-500">Desenvolvido por JPDev.</p>
</div>git config --global user.name "SeuNomeDeUsuário"
git config --global user.email "seu.email@exemplo.com""jspdf": "^3.0.1","jspdf-autotable": "^5.0.2",import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Interface para os registros de saúde
export interface HealthRecord {
  id: string;
  animalId: string;
  animalName: string;
  animalType: string;
  type: string;
  procedure: string;
  date: Date;
  veterinarian: string;
  notes: string;
  status: string;
}

// Dados iniciais (os mesmos que estão na página HistoricoSaude.tsx)
const initialHealthRecords = [
  {
    id: "HR-101",
    animalId: "BG-101",
    animalName: "Estrela",
    animalType: "Gado",
    type: "Vacinação",
    procedure: "Febre Aftosa",
    date: new Date(2025, 4, 1),
    veterinarian: "Dr. Carlos Silva",
    notes: "Aplicação de rotina, sem complicações.",
    status: "Concluído"
  },
  {
    id: "HR-102",
    animalId: "HC-101",
    animalName: "Ventania",
    animalType: "Cavalo",
    type: "Exame",
    procedure: "Exame de Sangue",
    date: new Date(2025, 3, 25),
    veterinarian: "Dra. Ana Oliveira",
    notes: "Resultados normais.",
    status: "Concluído"
  },
  {
    id: "HR-103",
    animalId: "BG-103",
    animalName: "Luna",
    animalType: "Gado",
    type: "Tratamento",
    procedure: "Antibióticos",
    date: new Date(2025, 3, 28),
    veterinarian: "Dr. Carlos Silva",
    notes: "Infecção leve. Tratar por 7 dias.",
    status: "Em andamento"
  },
  {
    id: "HR-104",
    animalId: "HC-103",
    animalName: "Lua Cheia",
    animalType: "Cavalo",
    type: "Vacinação",
    procedure: "Tétano",
    date: new Date(2025, 4, 5),
    veterinarian: "Dra. Ana Oliveira",
    notes: "Vacinação anual.",
    status: "Agendado"
  },
  {
    id: "HR-105",
    animalId: "BG-102",
    animalName: "Trovão",
    animalType: "Gado",
    type: "Consulta",
    procedure: "Avaliação Geral",
    date: new Date(2025, 4, 2),
    veterinarian: "Dr. Carlos Silva",
    notes: "Animal em boas condições.",
    status: "Concluído"
  },
];

export const useHealthHistory = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [animalTypeFilter, setAnimalTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.procedure.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAnimalType = animalTypeFilter === "all" || record.animalType === animalTypeFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesAnimalType && matchesStatus;
  });

  const handleViewRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de saúde?")) {
      setHealthRecords(healthRecords.filter(record => record.id !== recordId));
      toast({
        title: "Registro excluído",
        description: `O registro com ID ${recordId} foi removido com sucesso.`
      });
    }
  };

  const handleAddSuccess = (newRecord: HealthRecord) => {
    setHealthRecords([...healthRecords, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: "Registro adicionado",
      description: "O registro de saúde foi adicionado com sucesso."
    });
  };

  const handleEditSuccess = (updatedRecord: HealthRecord) => {
    setHealthRecords(healthRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Registro atualizado",
      description: "As informações do registro foram atualizadas."
    });
  };

  // Funções auxiliares para obter badges de status e tipo
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-500";
      case "Em andamento":
        return "bg-amber-500";
      case "Agendado":
        return "bg-blue-500";
      default:
        return "";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Vacinação":
        return "bg-purple-500";
      case "Exame":
        return "bg-cyan-500";
      case "Tratamento":
        return "bg-red-500";
      case "Consulta":
        return "bg-indigo-500";
      default:
        return "";
    }
  };

  return {
    healthRecords,
    filteredRecords,
    searchTerm,
    setSearchTerm,
    animalTypeFilter,
    setAnimalTypeFilter,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentRecord,
    handleViewRecord,
    handleEditRecord,
    handleDeleteRecord,
    handleAddSuccess,
    handleEditSuccess,
    getStatusBadge,
    getTypeBadge
  };
};import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema de validação do formulário
const healthHistorySchema = z.object({
  animalId: z.string().min(1, "ID do animal é obrigatório"),
  animalName: z.string().min(1, "Nome do animal é obrigatório"),
  animalType: z.string().min(1, "Tipo do animal é obrigatório"),
  type: z.string().min(1, "Tipo do procedimento é obrigatório"),
  procedure: z.string().min(1, "Procedimento é obrigatório"),
  date: z.date(),
  veterinarian: z.string().min(1, "Nome do veterinário é obrigatório"),
  notes: z.string().optional(),
  status: z.string().min(1, "Status é obrigatório"),
});

type HealthHistoryFormValues = z.infer<typeof healthHistorySchema>;

interface HealthHistoryFormProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function HealthHistoryForm({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false
}: HealthHistoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HealthHistoryFormValues>({
    resolver: zodResolver(healthHistorySchema),
    defaultValues: {
      animalId: "",
      animalName: "",
      animalType: "Gado",
      type: "Vacinação",
      procedure: "",
      date: new Date(),
      veterinarian: "",
      notes: "",
      status: "Agendado",
    },
  });

  // Preencher o formulário com dados iniciais se estiver editando
  useState(() => {
    if (initialData && isEditing) {
      form.reset({
        animalId: initialData.animalId || "",
        animalName: initialData.animalName || "",
        animalType: initialData.animalType || "Gado",
        type: initialData.type || "Vacinação",
        procedure: initialData.procedure || "",
        date: initialData.date || new Date(),
        veterinarian: initialData.veterinarian || "",
        notes: initialData.notes || "",
        status: initialData.status || "Agendado",
      });
    }
  });

  const onSubmit = (data: HealthHistoryFormValues) => {
    setIsSubmitting(true);
    
    // Simular chamada de API
    setTimeout(() => {
      console.log("Dados do registro de saúde:", data);
      
      // Criar um novo registro ou atualizar o existente
      const record = {
        id: isEditing && initialData ? initialData.id : `HR-${Math.floor(Math.random() * 1000)}`,
        ...data
      };
      
      setIsSubmitting(false);
      onSuccess(record);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="animalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Animal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: BG-101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="animalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Animal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Estrela" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="animalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Animal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo do animal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Gado">Gado</SelectItem>
                  <SelectItem value="Cavalo">Cavalo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo do Procedimento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo do procedimento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vacinação">Vacinação</SelectItem>
                  <SelectItem value="Exame">Exame</SelectItem>
                  <SelectItem value="Tratamento">Tratamento</SelectItem>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="procedure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Febre Aftosa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="veterinarian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veterinário</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Dr. Carlos Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Agendado">Agendado</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione observações sobre o procedimento..."
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-farm hover:bg-farm-dark" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HealthHistoryForm } from "./HealthHistoryForm";

interface HealthHistoryAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: any) => void;
}

export const HealthHistoryAddDialog = ({ 
  open, 
  onOpenChange,
  onSuccess
}: HealthHistoryAddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">Adicionar Novo Registro de Saúde</DialogTitle>
          <DialogDescription>Preencha os dados do procedimento de saúde</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <HealthHistoryForm 
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Settings, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealthHistory } from "@/hooks/use-health-history";
import { HealthHistoryAddDialog } from "@/components/health/HealthHistoryAddDialog";

const HistoricoSaude = () => {
  const {
    filteredRecords,
    searchTerm,
    setSearchTerm,
    animalTypeFilter,
    setAnimalTypeFilter,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddSuccess,
    getStatusBadge,
    getTypeBadge
  } = useHealthHistory();

  // Count health records by type
  const vaccineCount = filteredRecords.filter(record => record.type === "Vacinação").length;
  const examCount = filteredRecords.filter(record => record.type === "Exame").length;
  const treatmentCount = filteredRecords.filter(record => record.type === "Tratamento").length;
  const consultationCount = filteredRecords.filter(record => record.type === "Consulta").length;

  // Count health records by status
  const completedCount = filteredRecords.filter(record => record.status === "Concluído").length;
  const inProgressCount = filteredRecords.filter(record => record.status === "Em andamento").length;
  const scheduledCount = filteredRecords.filter(record => record.status === "Agendado").length;

  // Calculate upcoming health events
  const today = new Date();
  const upcomingEvents = filteredRecords
    .filter(record => record.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Funções de renderização de badges
  const renderStatusBadge = (status: string) => {
    return <Badge className={getStatusBadge(status)}>{status}</Badge>;
  };

  const renderTypeBadge = (type: string) => {
    return <Badge className={getTypeBadge(type)}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Histórico de Saúde</h1>
        <p className="text-gray-500">Acompanhe a saúde dos seus animais</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{vaccineCount}</h3>
              <p className="text-sm font-medium text-gray-500">Vacinações</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{examCount}</h3>
              <p className="text-sm font-medium text-gray-500">Exames</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{treatmentCount}</h3>
              <p className="text-sm font-medium text-gray-500">Tratamentos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{consultationCount}</h3>
              <p className="text-sm font-medium text-gray-500">Consultas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Registros</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <CardTitle className="text-farm">Registros de Saúde</CardTitle>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="Buscar registros..."
                      className="pl-10 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select 
                    value={animalTypeFilter} 
                    onValueChange={setAnimalTypeFilter}
                  >
                    <SelectTrigger className="w-full md:w-[140px]">
                      <SelectValue placeholder="Tipo de Animal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Gado">Gado</SelectItem>
                      <SelectItem value="Cavalo">Cavalo</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Agendado">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    className="bg-farm hover:bg-farm-dark"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Veterinário</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>
                          <div>
                            <p>{record.animalName}</p>
                            <p className="text-xs text-gray-500">{record.animalId} ({record.animalType})</p>
                          </div>
                        </TableCell>
                        <TableCell>{renderTypeBadge(record.type)}</TableCell>
                        <TableCell>{record.procedure}</TableCell>
                        <TableCell>
                          {format(record.date, "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>{record.veterinarian}</TableCell>
                        <TableCell>{renderStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restante do código permanece igual */}
        {/* ... */}
      </Tabs>

      {/* Diálogo para adicionar novo registro */}
      <HealthHistoryAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default HistoricoSaude;import { LayoutDashboard, Database, BarChart3, Calendar, FileText, Settings, X, Users, Activity, Baby } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
};

const SidebarLink = ({ icon: Icon, label, to, isActive }: SidebarLinkProps) => {
  return (
    <Link to={to} className={cn("sidebar-link", isActive && "active")}>
      <Icon size={20} className={isActive ? "text-farm" : "text-gray-600"} />
      <span>{label}</span>
    </Link>
  );
};

interface AppSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const AppSidebar = ({ isSidebarOpen, toggleSidebar }: AppSidebarProps) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Database, label: "Gestão de Gado", to: "/gestao-gado" },
    { icon: Users, label: "Gestão de Cavalos", to: "/gestao-cavalos" },
    { icon: Baby, label: "Reprodução Animal", to: "/reproducao" },
    { icon: Activity, label: "Histórico de Saúde", to: "/historico-saude" },
    { icon: BarChart3, label: "Relatórios", to: "/relatorios" },
    { icon: Calendar, label: "Calendário", to: "/calendario" },
    { icon: FileText, label: "Documentos", to: "/documentos" },
    { icon: Settings, label: "Configurações", to: "/configuracoes" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ 
              backgroundImage: "url('/lovable-uploads/35fbe54c-c706-4a1e-bd99-33c1b3f3a030.png')",
              filter: "blur(3px) brightness(0.9)",
            }}
          ></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="farm-logo text-white">FazendaPlus</div>
              <div className="farm-subtitle text-white/80">Gestão Premium</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-white"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.to}
              icon={link.icon}
              label={link.label}
              to={link.to}
              isActive={link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)}
            />
          ))}
        </div>
        
        {/* Desenvolvido por JPDev */}
        <div className="p-3 border-t">
          <p className="text-xs text-gray-500">Desenvolvido por JPDev.</p>
        </div>
      </div>
    </div>
  );
};
