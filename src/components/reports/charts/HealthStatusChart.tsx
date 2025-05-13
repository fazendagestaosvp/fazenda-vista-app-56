
import GenericChart from "./GenericChart";
import { healthData } from "../ReportsData";

const HealthStatusChart = () => {
  return (
    <GenericChart
      title="Status de Saúde dos Animais"
      description="Acompanhamento mensal do estado de saúde do rebanho"
      data={healthData}
      dataKeys={[
        { key: "saudaveis", name: "Saudáveis", color: "#10b981" },
        { key: "emTratamento", name: "Em Tratamento", color: "#f59e0b" },
        { key: "emObservacao", name: "Em Observação", color: "#3b82f6" }
      ]}
      xAxisDataKey="month"
    />
  );
};

export default HealthStatusChart;
