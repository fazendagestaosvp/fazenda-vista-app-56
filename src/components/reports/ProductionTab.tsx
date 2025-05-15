
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { productionData } from "./ReportsData";
import ProductionChart from "./charts/ProductionChart";
import AnimalReportCard from "./AnimalReportCard";

const milkProductionData = [
  { label: "Produção Total", value: "860 litros/semana" },
  { label: "Média por Animal", value: "12.5 litros/dia" },
  { label: "Melhor Produtor", value: "Vaca 2531 (18L/dia)" },
  { label: "Variação Mensal", value: "+8.2% vs. mês anterior" },
];

const cattleWeightData = [
  { label: "Média Atual", value: "475 kg" },
  { label: "Ganho Médio", value: "0.85 kg/dia" },
  { label: "Maior Animal", value: "Boi 1430 (620 kg)" },
  { label: "Menor Animal", value: "Novilha 2860 (320 kg)" },
];

const ProductionTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-farm">Visão Geral da Produção</CardTitle>
          <CardDescription>Dados da produção leiteira e ganho de peso durante o último semestre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-farm/10 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Produção Leiteira</span>
              <span className="text-2xl font-bold text-farm">860L</span>
              <span className="text-xs text-green-600">↑ 8.2%</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Ganho de Peso</span>
              <span className="text-2xl font-bold text-blue-600">0.85kg/dia</span>
              <span className="text-xs text-green-600">↑ 3.5%</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Nascimentos</span>
              <span className="text-2xl font-bold text-green-600">12</span>
              <span className="text-xs text-blue-600">↔ Estável</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Taxa de Conversão</span>
              <span className="text-2xl font-bold text-amber-600">1:3.8</span>
              <span className="text-xs text-green-600">↑ 2.1%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ProductionChart />
      
      <div className="grid gap-6 md:grid-cols-2">
        <AnimalReportCard 
          title="Produção de Leite" 
          data={milkProductionData}
          type="producao"
        />
        <AnimalReportCard 
          title="Desenvolvimento do Rebanho" 
          data={cattleWeightData}
          type="producao"
        />
      </div>
    </div>
  );
};

export default ProductionTab;
