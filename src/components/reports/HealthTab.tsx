
import HealthStatusChart from "./charts/HealthStatusChart";
import AnimalReportCard from "./AnimalReportCard";

const veterinaryServicesData = [
  { label: "Total de Atendimentos", value: "18 no último mês" },
  { label: "Vacinações", value: "12 animais" },
  { label: "Tratamentos Curativos", value: "5 procedimentos" },
  { label: "Exames de Rotina", value: "15 realizados" },
];

const medicineHistoryData = [
  { label: "Antibióticos", value: "4 administrações" },
  { label: "Anti-inflamatórios", value: "6 administrações" },
  { label: "Antiparasitários", value: "15 administrações" },
  { label: "Vitaminas e Suplementos", value: "8 administrações" },
];

const HealthTab = () => {
  return (
    <div className="space-y-6">
      <HealthStatusChart />
      
      <div className="grid gap-6 md:grid-cols-2">
        <AnimalReportCard 
          title="Atendimentos Veterinários" 
          data={veterinaryServicesData} 
        />
        <AnimalReportCard 
          title="Histórico de Medicamentos" 
          data={medicineHistoryData} 
        />
      </div>
    </div>
  );
};

export default HealthTab;
