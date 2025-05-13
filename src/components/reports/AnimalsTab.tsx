
import AnimalDistributionChart from "./charts/AnimalDistributionChart";
import WeightEvolutionChart from "./charts/WeightEvolutionChart";
import AnimalReportCard from "./AnimalReportCard";

const bovineReportData = [
  { label: "Quantidade Total", value: "25 animais" },
  { label: "Peso Médio", value: "475 kg" },
  { label: "Taxa de Crescimento", value: "2.3% mensal" },
  { label: "Saúde Geral", value: "92% saudáveis" },
];

const equineReportData = [
  { label: "Quantidade Total", value: "8 animais" },
  { label: "Peso Médio", value: "405 kg" },
  { label: "Taxa de Crescimento", value: "1.2% mensal" },
  { label: "Saúde Geral", value: "95% saudáveis" },
];

const AnimalsTab = () => {
  return (
    <div className="space-y-6">
      <AnimalDistributionChart />
      <WeightEvolutionChart />
      
      <div className="grid gap-6 md:grid-cols-2">
        <AnimalReportCard 
          title="Relatório de Bovinos" 
          data={bovineReportData} 
        />
        <AnimalReportCard 
          title="Relatório de Equinos" 
          data={equineReportData} 
        />
      </div>
    </div>
  );
};

export default AnimalsTab;
