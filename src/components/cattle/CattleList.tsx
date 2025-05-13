
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CattleListHeader } from "./CattleListHeader";
import { CattleListTable } from "./CattleListTable";

interface CattleListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredCattle: any[];
  onOpenAddDialog: () => void;
  onViewCattle: (animal: any) => void;
  onEditCattle: (animal: any) => void;
  onDeleteCattle: (animalId: string) => void;
}

export function CattleList({
  searchTerm,
  setSearchTerm,
  filteredCattle,
  onOpenAddDialog,
  onViewCattle,
  onEditCattle,
  onDeleteCattle,
}: CattleListProps) {
  return (
    <Card>
      <CardHeader>
        <CattleListHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onOpenAddDialog={onOpenAddDialog} 
        />
      </CardHeader>
      <CardContent>
        <CattleListTable
          filteredCattle={filteredCattle}
          onViewCattle={onViewCattle}
          onEditCattle={onEditCattle}
          onDeleteCattle={onDeleteCattle}
        />
      </CardContent>
    </Card>
  );
}
