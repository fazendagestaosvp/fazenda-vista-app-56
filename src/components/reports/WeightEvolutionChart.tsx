
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { weightData } from "./ReportsData";

const WeightEvolutionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">Evolução de Peso Médio</CardTitle>
        <CardDescription>
          Acompanhe o peso médio dos animais nos últimos meses
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weightData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bovinos" name="Bovinos (kg)" fill="#B67B24" />
            <Bar dataKey="equinos" name="Equinos (kg)" fill="#D19A39" />
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

export default WeightEvolutionChart;
