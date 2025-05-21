
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AnimalReportCardProps {
  title: string;
  data: {
    label: string;
    value: string;
  }[];
  type?: string;
}

const AnimalReportCard = ({ title, data, type = 'animais' }: AnimalReportCardProps) => {
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  
  const handleExportReport = () => {
    exportToPDF(type);
    toast.success("Relatório completo exportado com sucesso!");
  };

  return (
    <>
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
            onClick={() => setShowDetailedReport(true)}
          >
            Ver relatório completo <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetailedReport} onOpenChange={setShowDetailedReport}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Relatório Completo - {title}</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre {title.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium text-gray-700">{item.label}</p>
                  <p className="text-lg">{item.value}</p>
                </div>
              ))}
              <div className="pt-2">
                <Button onClick={handleExportReport} className="w-full">
                  Exportar para PDF
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnimalReportCard;
