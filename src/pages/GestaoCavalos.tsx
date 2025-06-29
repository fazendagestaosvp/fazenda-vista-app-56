
import React from "react";
import { HorseList } from "@/components/horses/HorseList";
import { HorseMetrics } from "@/components/horses/HorseMetrics";
import { HorseDetailsDialog } from "@/components/horses/details/HorseDetailsDialog";
import { AddHorseDialog } from "@/components/horses/add/AddHorseDialog";
import { useHorses } from "@/hooks/useHorses";

const GestaoCavalos = () => {
  const {
    horses,
    searchTerm,
    setSearchTerm,
    selectedHorse,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isAddHorseDialogOpen,
    setIsAddHorseDialogOpen,
    handleOpenHorseDetails,
    handleAddHorse,
    handleUpdateHorse,
    standardVaccinations,
    // Pagination props
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem
  } = useHorses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Gestão de Cavalos</h1>
        <p className="text-gray-500">Gerencie seus cavalos e linhagens genéticas</p>
      </div>

      <HorseMetrics horses={horses} />

      <HorseList
        horses={horses}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAddDialog={() => setIsAddHorseDialogOpen(true)}
        onOpenHorseDetails={handleOpenHorseDetails}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
      />

      <HorseDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        selectedHorse={selectedHorse}
        onUpdateHorse={handleUpdateHorse}
      />

      <AddHorseDialog
        isOpen={isAddHorseDialogOpen}
        onOpenChange={setIsAddHorseDialogOpen}
        onAddHorse={handleAddHorse}
        standardVaccinations={standardVaccinations}
      />
    </div>
  );
};

export default GestaoCavalos;
