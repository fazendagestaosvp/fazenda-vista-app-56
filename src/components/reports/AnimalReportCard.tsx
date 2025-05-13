
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AnimalReportCardProps {
  title: string;
  data: {
    label: string;
    value: string;
  }[];
}

const AnimalReportCard = ({ title, data }: AnimalReportCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-farm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
          Ver relatório completo <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnimalReportCard;
