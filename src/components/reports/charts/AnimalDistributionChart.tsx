
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Filter, Eye } from 'lucide-react';
import { animalData } from '../ReportsData';
import { exportToPDF } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#B67B24', '#D19A39', '#E5BB5A'];

const AnimalDistributionChart = () => {
  const total = animalData.reduce((acc, curr) => acc + curr.quantidade, 0);
  const [showDetails, setShowDetails] = useState(false);

  const handleExportData = () => {
    exportToPDF('animais');
    toast.success("Dados de distribuição animal exportados com sucesso!");
  };

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
        <Button variant="outline" onClick={() => setShowDetails(true)}>
          <Eye size={16} className="mr-2" /> Ver detalhes
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <FileDown size={16} />
          Exportar
        </Button>
      </CardFooter>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes de Distribuição Animal</DialogTitle>
            <DialogDescription>
              Detalhamento completo da distribuição por categorias
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Categoria</th>
                  <th className="text-left py-2">Quantidade</th>
                  <th className="text-left py-2">Percentual</th>
                </tr>
              </thead>
              <tbody>
                {animalData.map((animal, index) => {
                  const percentage = ((animal.quantidade / total) * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: animal.cor }}
                          />
                          {animal.categoria}
                        </div>
                      </td>
                      <td className="py-2">{animal.quantidade}</td>
                      <td className="py-2">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnimalDistributionChart;
