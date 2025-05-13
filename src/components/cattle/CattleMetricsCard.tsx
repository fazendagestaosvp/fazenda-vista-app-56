
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CattleMetricsCardProps {
  title: string;
  value: string | number;
  trend: {
    value: string;
    positive: boolean;
  };
}

export function CattleMetricsCard({ title, value, trend }: CattleMetricsCardProps) {
  const TrendIcon = trend.positive ? ArrowUp : ArrowDown;
  const trendColor = trend.positive ? "text-green-500" : "text-red-500";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-4xl font-bold mt-1">{value}</h3>
            <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
              <TrendIcon size={14} className="mr-1" />
              <span>{trend.value}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
