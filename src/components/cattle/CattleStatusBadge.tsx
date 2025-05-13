
import { Badge } from "@/components/ui/badge";

interface CattleStatusBadgeProps {
  status: string;
}

export function CattleStatusBadge({ status }: CattleStatusBadgeProps) {
  switch (status) {
    case "Saudável":
      return <Badge className="bg-green-500">Saudável</Badge>;
    case "Em tratamento":
      return <Badge className="bg-amber-500">Em tratamento</Badge>;
    case "Em observação":
      return <Badge className="bg-blue-500">Em observação</Badge>;
    case "Doente":
      return <Badge className="bg-red-500">Doente</Badge>;
    case "Vendido":
      return <Badge className="bg-purple-500">Vendido</Badge>;
    case "Óbito":
      return <Badge className="bg-gray-500">Óbito</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}
