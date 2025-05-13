
import GenericChart from "./GenericChart";
import { animalData } from "../ReportsData";

const AnimalDistributionChart = () => {
  return (
    <GenericChart
      title="Distribuição de Animais"
      description="Quantidade de animais por categoria"
      data={animalData}
      dataKeys={[
        { key: "quantidade", name: "Quantidade", color: "#B67B24" }
      ]}
      xAxisDataKey="categoria"
    />
  );
};

export default AnimalDistributionChart;
