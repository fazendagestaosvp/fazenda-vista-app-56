
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Eye } from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportToPDF } from "@/lib/utils";
import { toast } from "sonner";

interface GenericChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  xAxisDataKey: string;
  reportType?: string;
}

const GenericChart = ({
  title,
  description,
  data,
  dataKeys,
  xAxisDataKey,
  reportType = "animais",
}: GenericChartProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleExportData = () => {
    exportToPDF(reportType);
    toast.success("Dados exportados com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={Object.fromEntries(
            dataKeys.map(item => [item.key, { color: item.color, label: item.name }])
          )}
        >
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {dataKeys.map((item, index) => (
              <Bar 
                key={index}
                dataKey={item.key} 
                name={item.name} 
                fill={item.color} 
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowDetails(true)}>
          <Eye size={16} className="mr-2" /> Ver detalhes
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
          <FileDown size={16} />
          Exportar
        </Button>
      </CardFooter>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Gráfico</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre {title.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{xAxisDataKey}</th>
                  {dataKeys.map((item, index) => (
                    <th key={index} className="text-left py-2">{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item[xAxisDataKey]}</td>
                    {dataKeys.map((dataKey, idx) => (
                      <td key={idx} className="py-2">{item[dataKey.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GenericChart;
