
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/utils";

interface AnimalReportCardProps {
  title: string;
  data: {
    label: string;
    value: string;
  }[];
  type?: string;
}

const AnimalReportCard = ({ title, data, type = 'animais' }: AnimalReportCardProps) => {
  const handleViewDetailedReport = () => {
    exportToPDF(type);
    toast.success("Relatório completo exportado com sucesso!");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-farm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {data.map((item, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}`}
            >
              <span className="text-gray-700 font-medium">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-center gap-2 text-farm hover:text-farm-dark"
          onClick={handleViewDetailedReport}
        >
          Ver relatório completo <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalReportCard;
