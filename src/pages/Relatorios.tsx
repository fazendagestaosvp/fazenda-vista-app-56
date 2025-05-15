
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimalsTab from "@/components/reports/AnimalsTab";
import HealthTab from "@/components/reports/HealthTab";
import ProductionTab from "@/components/reports/ProductionTab";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback } from "react";
import { exportToPDF } from "@/lib/utils";

const Relatorios = () => {
  const [activeTab, setActiveTab] = React.useState("animais");
  
  const handleExportData = useCallback(() => {
    exportToPDF(activeTab);
    toast.success("Relatório exportado com sucesso!");
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-farm">Relatórios</h1>
          <p className="text-gray-500">Análise de dados e relatórios da sua fazenda</p>
        </div>
        <Button variant="outline" className="flex gap-2" onClick={handleExportData}>
          <Download size={16} /> Exportar Dados
        </Button>
      </div>

      <Tabs defaultValue="animais" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="animais">Animais</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
          <TabsTrigger value="producao">Produção</TabsTrigger>
        </TabsList>
        
        <TabsContent value="animais" className="space-y-6">
          <AnimalsTab />
        </TabsContent>
        
        <TabsContent value="saude" className="space-y-6">
          <HealthTab />
        </TabsContent>

        <TabsContent value="producao" className="space-y-6">
          <ProductionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
