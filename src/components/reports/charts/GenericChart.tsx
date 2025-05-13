
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
import { FileDown } from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

interface GenericChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  xAxisDataKey: string;
}

const GenericChart = ({
  title,
  description,
  data,
  dataKeys,
  xAxisDataKey,
}: GenericChartProps) => {
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
        <Button variant="outline">Ver detalhes</Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown size={16} />
          Exportar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GenericChart;
