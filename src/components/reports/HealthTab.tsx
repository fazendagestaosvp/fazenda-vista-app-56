
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HealthStatusChart from "./charts/HealthStatusChart";
import AnimalReportCard from "./AnimalReportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const veterinaryServicesData = [
  { label: "Total de Atendimentos", value: "18 no último mês" },
  { label: "Vacinações", value: "12 animais" },
  { label: "Tratamentos Curativos", value: "5 procedimentos" },
  { label: "Exames de Rotina", value: "15 realizados" },
];

const medicineHistoryData = [
  { label: "Antibióticos", value: "4 administrações" },
  { label: "Anti-inflamatórios", value: "6 administrações" },
  { label: "Antiparasitários", value: "15 administrações" },
  { label: "Vitaminas e Suplementos", value: "8 administrações" },
];

const upcomingVaccinesData = [
  { label: "Febre Aftosa", value: "12/07/2025" },
  { label: "Brucelose", value: "25/08/2025" },
  { label: "Clostridioses", value: "10/06/2025" },
  { label: "Raiva", value: "03/09/2025" },
];

const HealthTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-farm">Visão Geral da Saúde</CardTitle>
          <CardDescription>Informações consolidadas sobre a saúde do rebanho</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Animais Saudáveis</span>
              <span className="text-3xl font-bold text-green-600">34</span>
              <span className="text-xs text-green-600">92% do rebanho</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Em Tratamento</span>
              <span className="text-3xl font-bold text-amber-600">1</span>
              <span className="text-xs text-amber-600">3% do rebanho</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Em Observação</span>
              <span className="text-3xl font-bold text-blue-600">2</span>
              <span className="text-xs text-blue-600">5% do rebanho</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Próx. Vacinação</span>
              <span className="text-xl font-bold text-purple-600">10/06</span>
              <span className="text-xs text-purple-600">Clostridioses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
          <TabsTrigger value="schedule">Agenda</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <HealthStatusChart />
        </TabsContent>
        
        <TabsContent value="treatments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimalReportCard 
              title="Atendimentos Veterinários" 
              data={veterinaryServicesData}
              type="saude"
            />
            <AnimalReportCard 
              title="Histórico de Medicamentos" 
              data={medicineHistoryData}
              type="saude" 
            />
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Próximas Vacinações</CardTitle>
              <CardDescription>Calendário de vacinações programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-gray-500">Vacina</th>
                    <th className="py-2 text-left text-gray-500">Data</th>
                    <th className="py-2 text-left text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingVaccinesData.map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3 font-medium">{item.label}</td>
                      <td className="py-3">{item.value}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">
                          Agendada
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthTab;
