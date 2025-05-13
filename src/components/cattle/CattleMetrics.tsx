
import { CattleMetricsCard } from "./CattleMetricsCard";

export function CattleMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <CattleMetricsCard
        title="Total de Gado"
        value="25"
        trend={{ value: "3.5% último mês", positive: true }}
      />
      <CattleMetricsCard
        title="Peso Médio"
        value="498kg"
        trend={{ value: "1.8% último mês", positive: true }}
      />
      <CattleMetricsCard
        title="Saúde"
        value="92%"
        trend={{ value: "2.1% último mês", positive: false }}
      />
    </div>
  );
}
