
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { productionData } from '../ReportsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { FileText, History } from 'lucide-react';
import { exportToPDF } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProductionChart = () => {
  const [showHistory, setShowHistory] = useState(false);
  
  const handleExportData = () => {
    exportToPDF('producao');
    toast.success("Dados de produção exportados com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">Evolução da Produção</CardTitle>
        <CardDescription>Acompanhamento da produção de leite e ganho de peso nos últimos meses</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            leite: { color: "#9b87f5", label: "Leite (litros/semana)" },
            ganho: { color: "#B67B24", label: "Ganho de peso (kg/dia)" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={productionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="leite" 
                name="Leite (litros/semana)"
                stroke="#9b87f5" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ganho" 
                name="Ganho de Peso (kg/dia)"
                stroke="#B67B24" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowHistory(true)}>
          <History size={16} className="mr-2" /> Ver histórico completo
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <FileText size={16} />
          Exportar dados
        </Button>
      </CardFooter>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Histórico Completo de Produção</DialogTitle>
            <DialogDescription>
              Dados detalhados de produção nos últimos meses
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Mês</th>
                  <th className="text-left py-2">Leite (L/semana)</th>
                  <th className="text-left py-2">Ganho de Peso (kg/dia)</th>
                </tr>
              </thead>
              <tbody>
                {productionData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.month}</td>
                    <td className="py-2">{item.leite}</td>
                    <td className="py-2">{item.ganho.toFixed(2)}</td>
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

export default ProductionChart;
