
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { productionData } from '../ReportsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const ProductionChart = () => {
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
    </Card>
  );
};

export default ProductionChart;
