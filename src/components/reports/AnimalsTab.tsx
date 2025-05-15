
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimalDistributionChart from "./charts/AnimalDistributionChart";
import WeightEvolutionChart from "./charts/WeightEvolutionChart";
import AnimalReportCard from "./AnimalReportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bovineReportData = [
  { label: "Quantidade Total", value: "25 animais" },
  { label: "Peso Médio", value: "475 kg" },
  { label: "Taxa de Crescimento", value: "2.3% mensal" },
  { label: "Saúde Geral", value: "92% saudáveis" },
];

const equineReportData = [
  { label: "Quantidade Total", value: "8 animais" },
  { label: "Peso Médio", value: "405 kg" },
  { label: "Taxa de Crescimento", value: "1.2% mensal" },
  { label: "Saúde Geral", value: "95% saudáveis" },
];

const AnimalsTab = () => {
  const [period, setPeriod] = useState<"mensal" | "trimestral" | "semestral">("mensal");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-farm">Visão Geral do Rebanho</CardTitle>
          <CardDescription>Informações consolidadas sobre o rebanho atual</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-farm/10 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Total de Animais</span>
              <span className="text-3xl font-bold text-farm">41</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Bovinos</span>
              <span className="text-3xl font-bold text-purple-600">33</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Equinos</span>
              <span className="text-3xl font-bold text-amber-600">8</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Taxa de Natalidade</span>
              <span className="text-3xl font-bold text-green-600">12%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="graficos" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="bovinos">Dados de Bovinos</TabsTrigger>
          <TabsTrigger value="equinos">Dados de Equinos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graficos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Distribuição por Categoria</h3>
              <AnimalDistributionChart />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Evolução de Peso</h3>
                <div className="flex gap-2">
                  <button 
                    className={`text-xs px-2 py-1 rounded ${period === 'mensal' ? 'bg-farm text-white' : 'bg-gray-100'}`}
                    onClick={() => setPeriod('mensal')}
                  >
                    Mensal
                  </button>
                  <button 
                    className={`text-xs px-2 py-1 rounded ${period === 'trimestral' ? 'bg-farm text-white' : 'bg-gray-100'}`}
                    onClick={() => setPeriod('trimestral')}
                  >
                    Trimestral
                  </button>
                  <button 
                    className={`text-xs px-2 py-1 rounded ${period === 'semestral' ? 'bg-farm text-white' : 'bg-gray-100'}`}
                    onClick={() => setPeriod('semestral')}
                  >
                    Semestral
                  </button>
                </div>
              </div>
              <WeightEvolutionChart />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bovinos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimalReportCard 
              title="Relatório de Bovinos" 
              data={bovineReportData} 
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-farm">Divisão por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Vacas</span>
                    <div className="flex gap-2 items-center">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="bg-farm h-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm font-medium">16</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Touros</span>
                    <div className="flex gap-2 items-center">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="bg-farm h-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm font-medium">4</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bezerros</span>
                    <div className="flex gap-2 items-center">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="bg-farm h-full" style={{ width: '18%' }}></div>
                      </div>
                      <span className="text-sm font-medium">5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Novilhas</span>
                    <div className="flex gap-2 items-center">
                      <div className="w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="bg-farm h-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm font-medium">8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="equinos" className="space-y-6">
          <AnimalReportCard 
            title="Relatório de Equinos" 
            data={equineReportData} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimalsTab;
