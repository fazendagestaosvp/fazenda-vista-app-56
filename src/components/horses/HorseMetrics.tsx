
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HorseMetricsProps {
  horses: any[];
}

export function HorseMetrics({ horses }: HorseMetricsProps) {
  const femaleCount = horses.filter(h => h.gender === "Fêmea").length;
  const maleCount = horses.filter(h => h.gender === "Macho").length;
  const femalePercentage = Math.round((femaleCount / horses.length) * 100) || 0;
  const malePercentage = Math.round((maleCount / horses.length) * 100) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Cavalos</p>
              <h3 className="text-4xl font-bold mt-1">{horses.length}</h3>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <ArrowUp size={14} className="mr-1" />
                <span>1.2% último mês</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Fêmeas</p>
              <h3 className="text-4xl font-bold mt-1">{femaleCount}</h3>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <span>{femalePercentage}% do total</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Machos</p>
              <h3 className="text-4xl font-bold mt-1">{maleCount}</h3>
              <div className="flex items-center mt-2 text-sm text-red-500">
                <ArrowDown size={14} className="mr-1" />
                <span>{malePercentage}% do total</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
