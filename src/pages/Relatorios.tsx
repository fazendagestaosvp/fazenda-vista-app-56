
import { BarChart, LineChart, BarChart3, ArrowRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const productionData = [
  { month: "Jan", leite: 1500, carne: 300, milho: 700 },
  { month: "Fev", leite: 1700, carne: 250, milho: 650 },
  { month: "Mar", leite: 1800, carne: 320, milho: 700 },
  { month: "Abr", leite: 1600, carne: 280, milho: 750 },
  { month: "Mai", leite: 2000, carne: 300, milho: 800 },
  { month: "Jun", leite: 1900, carne: 270, milho: 820 },
];

const animalData = [
  { categoria: "Bovinos", quantidade: 25, cor: "#B67B24" },
  { categoria: "Equinos", quantidade: 8, cor: "#D19A39" },
  { categoria: "Ovinos", quantidade: 12, cor: "#E0B25E" },
  { categoria: "Suínos", quantidade: 5, cor: "#EAC683" },
];

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Relatórios</h1>
        <p className="text-gray-500">Análise de dados e relatórios da sua fazenda</p>
      </div>

      <Tabs defaultValue="producao">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="producao">Produção</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="animais">Animais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="producao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Produção Mensal</CardTitle>
              <CardDescription>
                Acompanhe a produção da fazenda nos últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leite" name="Leite (L)" fill="#B67B24" />
                  <Bar dataKey="carne" name="Carne (kg)" fill="#D19A39" />
                  <Bar dataKey="milho" name="Milho (kg)" fill="#EAC683" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver detalhes</Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown size={16} />
                Exportar
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-farm">Relatório de Produção de Leite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Produção Total</span>
                    <span className="font-medium">12.500 litros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Média Diária</span>
                    <span className="font-medium">416 litros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Produtividade p/ Animal</span>
                    <span className="font-medium">27.8 litros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Valor Mensal Estimado</span>
                    <span className="font-medium">R$ 24.500,00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                  Ver relatório completo <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-farm">Relatório de Safra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Milho Produzido</span>
                    <span className="font-medium">4.220 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Produtividade p/ Hectare</span>
                    <span className="font-medium">5.275 kg/ha</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Área Total Plantada</span>
                    <span className="font-medium">0.8 hectares</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Valor Estimado da Safra</span>
                    <span className="font-medium">R$ 8.440,00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                  Ver relatório completo <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Fluxo de Caixa</CardTitle>
              <CardDescription>
                Visão geral dos gastos e receitas dos últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">Selecione um período para visualizar o fluxo de caixa.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="animais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Distribuição de Animais</CardTitle>
              <CardDescription>
                Quantidade de animais por categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={animalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" name="Quantidade" fill="#B67B24" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
