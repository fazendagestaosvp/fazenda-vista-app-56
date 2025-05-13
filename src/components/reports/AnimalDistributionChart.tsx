
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { animalData } from "./ReportsData";

const AnimalDistributionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">Distribuição de Animais</CardTitle>
        <CardDescription>
          Quantidade de animais por categoria
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={animalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" name="Quantidade" fill="#B67B24" />
          </BarChart>
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
