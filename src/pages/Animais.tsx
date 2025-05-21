
import { Card, CardContent } from "@/components/ui/card";
import { useAnimals, Animal } from "@/hooks/use-animals-with-auth";
import { AnimalTable } from "@/components/animals/AnimalTable";
import { AnimalListHeader } from "@/components/animals/AnimalListHeader";
import { AnimalDetailsDialog } from "@/components/animals/AnimalDetailsDialog";
import { AnimalEditDialog } from "@/components/animals/AnimalEditDialog";
import { AnimalAddDialog } from "@/components/animals/AnimalAddDialog";

const Animais = () => {
  const {
    filteredAnimals,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentAnimal,
    handleViewAnimal,
    handleEditAnimal,
    handleDeleteAnimal,
    handleAddSuccess,
    handleEditSuccess,
    convertToCattleFormat,
    canAdd,
    canEdit,
    canDelete
  } = useAnimals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Animais</h1>
        <p className="text-gray-500">Gerencie seu rebanho e cadastro de animais</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <AnimalListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsAddDialogOpen(true)}
            canAdd={canAdd}
          />
          
          <AnimalTable
            animals={filteredAnimals}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={handleViewAnimal}
            onEdit={handleEditAnimal}
            onDelete={handleDeleteAnimal}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AnimalAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={(animal) => handleAddSuccess(animal)}
      />

      <AnimalDetailsDialog
        animal={currentAnimal}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <AnimalEditDialog
        animal={currentAnimal}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
        convertToCattleFormat={convertToCattleFormat}
      />
    </div>
  );
};

export default Animais;
