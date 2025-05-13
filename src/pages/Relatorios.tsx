
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimalsTab from "@/components/reports/AnimalsTab";
import HealthTab from "@/components/reports/HealthTab";

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Relatórios</h1>
        <p className="text-gray-500">Análise de dados e relatórios da sua fazenda</p>
      </div>

      <Tabs defaultValue="animais">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="animais">Animais</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
        </TabsList>
        
        <TabsContent value="animais" className="space-y-6">
          <AnimalsTab />
        </TabsContent>
        
        <TabsContent value="saude" className="space-y-6">
          <HealthTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
