
import { Badge } from "@/components/ui/badge";

interface HorseStatusBadgeProps {
  status: string;
}

export function HorseStatusBadge({ status }: HorseStatusBadgeProps) {
  // Extract the first part of the status (before the hyphen)
  const statusParts = status.split(" - ");
  const mainStatus = statusParts[0];
  
  let badgeColor = "";
  
  switch (mainStatus) {
    case "Ativo":
      badgeColor = "bg-green-500";
      break;
    case "Em treinamento":
      badgeColor = "bg-blue-500";
      break;
    case "Em descanso":
      badgeColor = "bg-amber-500";
      break;
    case "Vendido":
      badgeColor = "bg-purple-500";
      break;
    case "Morto":
      badgeColor = "bg-red-500";
      break;
    case "Inseminado":
      badgeColor = "bg-pink-500";
      break;
    default:
      badgeColor = "";
  }
  
  return <Badge className={badgeColor}>{status}</Badge>;
}
