import React from "react";
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
    vaccineCount,
    examCount,
    treatmentCount,
    consultationCount,
    completedCount,
    inProgressCount,
    scheduledCount,
    upcomingEvents
  } = useHealthHistory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluído":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "Em andamento":
        return <Badge className="bg-amber-500">Em andamento</Badge>;
      case "Agendado":
        return <Badge className="bg-blue-500">Agendado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Vacinação":
        return <Badge className="bg-purple-500">Vacinação</Badge>;
      case "Exame":
        return <Badge className="bg-cyan-500">Exame</Badge>;
      case "Tratamento":
        return <Badge className="bg-red-500">Tratamento</Badge>;
      case "Consulta":
        return <Badge className="bg-indigo-500">Consulta</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-farm">Histórico de Saúde</h1>
            <p className="text-gray-500">Acompanhe a saúde dos seus animais</p>
          </div>
          <Button 
            className="bg-farm hover:bg-farm-dark"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar
          </Button>
        </div>
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
                        <TableCell>{getTypeBadge(record.type)}</TableCell>
                        <TableCell>{record.procedure}</TableCell>
                        <TableCell>
                          {format(record.date, "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>{record.veterinarian}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
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

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Próximos Eventos de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-3 border rounded-md">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <Calendar size={24} className="text-farm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{event.procedure}</h3>
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(event.date, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm">
                            {event.animalName} ({event.animalId})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Nenhum evento próximo</h3>
                  <p className="text-gray-500 mt-1">
                    Não existem eventos de saúde agendados para os próximos dias.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-farm">Por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Concluído</span>
                    </div>
                    <span className="font-medium">{completedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>Em andamento</span>
                    </div>
                    <span className="font-medium">{inProgressCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Agendado</span>
                    </div>
                    <span className="font-medium">{scheduledCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-farm">Por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Vacinação</span>
                    </div>
                    <span className="font-medium">{vaccineCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
                      <span>Exame</span>
                    </div>
                    <span className="font-medium">{examCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Tratamento</span>
                    </div>
                    <span className="font-medium">{treatmentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                      <span>Consulta</span>
                    </div>
                    <span className="font-medium">{consultationCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo para adicionar novo registro de saúde */}
      <HealthHistoryAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
        animalType={animalTypeFilter !== "all" ? animalTypeFilter : undefined}
      />
    </div>
  );
};

export default HistoricoSaude;
