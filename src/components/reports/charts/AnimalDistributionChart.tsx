
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Filter } from 'lucide-react';
import { animalData } from '../ReportsData';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#B67B24', '#D19A39', '#E5BB5A'];

const AnimalDistributionChart = () => {
  const total = animalData.reduce((acc, curr) => acc + curr.quantidade, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-farm">Distribuição de Animais</CardTitle>
            <CardDescription>Total de {total} animais na propriedade</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-80 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={animalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="quantidade"
              nameKey="categoria"
              label={({ categoria, quantidade, percent }) => `${categoria}: ${quantidade} (${(percent * 100).toFixed(0)}%)`}
            >
              {animalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} animais`, name]}
              labelFormatter={() => ''}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
            />
          </PieChart>
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
  );
};

export default AnimalDistributionChart;
