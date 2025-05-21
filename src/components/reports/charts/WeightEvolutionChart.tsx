
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, History, CalendarDays } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { weightData } from '../ReportsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { exportToPDF } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const WeightEvolutionChart = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleExportData = () => {
    exportToPDF('animais');
    toast.success("Dados de evolução de peso exportados com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-farm">Evolução de Peso Médio</CardTitle>
            <CardDescription>Acompanhe o peso médio dos animais nos últimos meses</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <CalendarDays className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            bovinos: { color: "#9b87f5", label: "Bovinos (kg)" },
            equinos: { color: "#D19A39", label: "Equinos (kg)" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weightData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#666' }}
              />
              <YAxis 
                tick={{ fill: '#666' }}
                domain={['dataMin - 20', 'dataMax + 20']}
                tickCount={7}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bovinos" 
                name="Bovinos (kg)" 
                stroke="#9b87f5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="equinos" 
                name="Equinos (kg)" 
                stroke="#D19A39" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowDetails(true)}>
          <History size={16} className="mr-2" /> Ver histórico completo
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <FileDown size={16} />
          Exportar dados
        </Button>
      </CardFooter>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Histórico Completo de Evolução de Peso</DialogTitle>
            <DialogDescription>
              Acompanhamento mensal do peso médio dos animais
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mês</th>
                  <th className="text-left py-2">Bovinos (kg)</th>
                  <th className="text-left py-2">Equinos (kg)</th>
                </tr>
              </thead>
              <tbody>
                {weightData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.month}</td>
                    <td className="py-2">{item.bovinos}</td>
                    <td className="py-2">{item.equinos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WeightEvolutionChart;
