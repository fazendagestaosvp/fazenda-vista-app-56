
import { BarChart, LineChart, BarChart3, ArrowRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const animalData = [
  { categoria: "Bovinos", quantidade: 25, cor: "#B67B24" },
  { categoria: "Equinos", quantidade: 8, cor: "#D19A39" },
];

const weightData = [
  { month: "Jan", bovinos: 450, equinos: 380 },
  { month: "Fev", bovinos: 455, equinos: 385 },
  { month: "Mar", bovinos: 460, equinos: 390 },
  { month: "Abr", bovinos: 465, equinos: 395 },
  { month: "Mai", bovinos: 470, equinos: 400 },
  { month: "Jun", bovinos: 475, equinos: 405 },
];

const healthData = [
  { month: "Jan", saudaveis: 42, emTratamento: 5, emObservacao: 3 },
  { month: "Fev", saudaveis: 44, emTratamento: 3, emObservacao: 3 },
  { month: "Mar", saudaveis: 45, emTratamento: 2, emObservacao: 3 },
  { month: "Abr", saudaveis: 43, emTratamento: 4, emObservacao: 3 },
  { month: "Mai", saudaveis: 42, emTratamento: 5, emObservacao: 3 },
  { month: "Jun", saudaveis: 44, emTratamento: 3, emObservacao: 3 },
];

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Relatórios</h1>
        <p className="text-gray-500">Análise de dados e relatórios da sua fazenda</p>
      </div>

      <Tabs defaultValue="animais">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="animais">Animais</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
        </TabsList>
        
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
            <CardFooter className="flex justify-between">
              <Button variant="outline">Ver detalhes</Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown size={16} />
                Exportar
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Evolução de Peso Médio</CardTitle>
              <CardDescription>
                Acompanhe o peso médio dos animais nos últimos meses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={weightData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bovinos" name="Bovinos (kg)" fill="#B67B24" />
                  <Bar dataKey="equinos" name="Equinos (kg)" fill="#D19A39" />
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
                <CardTitle className="text-farm">Relatório de Bovinos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Quantidade Total</span>
                    <span className="font-medium">25 animais</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Peso Médio</span>
                    <span className="font-medium">475 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Taxa de Crescimento</span>
                    <span className="font-medium">2.3% mensal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Saúde Geral</span>
                    <span className="font-medium">92% saudáveis</span>
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
                <CardTitle className="text-farm">Relatório de Equinos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Quantidade Total</span>
                    <span className="font-medium">8 animais</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Peso Médio</span>
                    <span className="font-medium">405 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Taxa de Crescimento</span>
                    <span className="font-medium">1.2% mensal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Saúde Geral</span>
                    <span className="font-medium">95% saudáveis</span>
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
        
        <TabsContent value="saude" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-farm">Status de Saúde dos Animais</CardTitle>
              <CardDescription>
                Acompanhamento mensal do estado de saúde do rebanho
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="saudaveis" name="Saudáveis" fill="#10b981" />
                  <Bar dataKey="emTratamento" name="Em Tratamento" fill="#f59e0b" />
                  <Bar dataKey="emObservacao" name="Em Observação" fill="#3b82f6" />
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
                <CardTitle className="text-farm">Atendimentos Veterinários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total de Atendimentos</span>
                    <span className="font-medium">18 no último mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Vacinações</span>
                    <span className="font-medium">12 animais</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Tratamentos Curativos</span>
                    <span className="font-medium">5 procedimentos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Exames de Rotina</span>
                    <span className="font-medium">15 realizados</span>
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
                <CardTitle className="text-farm">Histórico de Medicamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Antibióticos</span>
                    <span className="font-medium">4 administrações</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Anti-inflamatórios</span>
                    <span className="font-medium">6 administrações</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Antiparasitários</span>
                    <span className="font-medium">15 administrações</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Vitaminas e Suplementos</span>
                    <span className="font-medium">8 administrações</span>
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
      </Tabs>
    </div>
  );
};

export default Relatorios;
