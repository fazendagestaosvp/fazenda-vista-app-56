
import GenericChart from "./GenericChart";
import { weightData } from "../ReportsData";

const WeightEvolutionChart = () => {
  return (
    <GenericChart
      title="Evolução de Peso Médio"
      description="Acompanhe o peso médio dos animais nos últimos meses"
      data={weightData}
      dataKeys={[
        { key: "bovinos", name: "Bovinos (kg)", color: "#B67B24" },
        { key: "equinos", name: "Equinos (kg)", color: "#D19A39" }
      ]}
      xAxisDataKey="month"
    />
  );
};

export default WeightEvolutionChart;
