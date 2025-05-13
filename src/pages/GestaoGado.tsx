
import React from "react";
import { Card } from "@/components/ui/card";
import { CattleMetrics } from "@/components/cattle/CattleMetrics";
import { CattleList } from "@/components/cattle/CattleList";
import { CattleDialogs } from "@/components/cattle/CattleDialogs";
import { useCattle } from "@/hooks/use-cattle";

const GestaoGado = () => {
  const {
    searchTerm,
    setSearchTerm,
    filteredCattle,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    currentCattle,
    handleAddCattleSuccess,
    handleViewCattle,
    handleEditCattle,
    handleDeleteCattle,
    handleEditSuccess
  } = useCattle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Gestão de Gado</h1>
        <p className="text-gray-500">Gerencie seu rebanho de forma eficiente</p>
      </div>

      <CattleMetrics />

      <CattleList
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredCattle={filteredCattle}
        onOpenAddDialog={() => setIsAddDialogOpen(true)}
        onViewCattle={handleViewCattle}
        onEditCattle={handleEditCattle}
        onDeleteCattle={handleDeleteCattle}
      />

      <CattleDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        currentCattle={currentCattle}
        onAddSuccess={handleAddCattleSuccess}
        onEditSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default GestaoGado;
