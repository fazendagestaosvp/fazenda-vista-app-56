
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { healthData } from "./ReportsData";

const HealthStatusChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">Status de Saúde dos Animais</CardTitle>
        <CardDescription>
          Acompanhamento mensal do estado de saúde do rebanho
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="saudaveis" name="Saudáveis" fill="#10b981" />
            <Bar dataKey="emTratamento" name="Em Tratamento" fill="#f59e0b" />
            <Bar dataKey="emObservacao" name="Em Observação" fill="#3b82f6" />
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

export default HealthStatusChart;
