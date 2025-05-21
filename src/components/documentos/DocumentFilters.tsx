
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface DocumentFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export function DocumentFilters({ activeTab, onTabChange, children }: DocumentFiltersProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="pastas">Pastas</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
}
