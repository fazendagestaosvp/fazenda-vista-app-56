
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Filter } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { healthData } from '../ReportsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const HealthStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-farm">Status de Saúde dos Animais</CardTitle>
            <CardDescription>Acompanhamento mensal do estado de saúde do rebanho</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            saudaveis: { color: "#10b981", label: "Saudáveis" },
            emTratamento: { color: "#f59e0b", label: "Em Tratamento" },
            emObservacao: { color: "#3b82f6", label: "Em Observação" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={healthData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar 
                dataKey="saudaveis" 
                name="Saudáveis" 
                stackId="a" 
                fill="#10b981" 
              />
              <Bar 
                dataKey="emTratamento" 
                name="Em Tratamento" 
                stackId="a" 
                fill="#f59e0b" 
              />
              <Bar 
                dataKey="emObservacao" 
                name="Em Observação" 
                stackId="a" 
                fill="#3b82f6" 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Ver relatório completo</Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown size={16} />
          Exportar dados
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthStatusChart;
