
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReproducaoHeader } from "@/components/reproducao/ReproducaoHeader";
import { ReproducaoTable } from "@/components/reproducao/ReproducaoTable";
import { ReproducaoAddDialog } from "@/components/reproducao/ReproducaoAddDialog";
import { useReproducao } from "@/hooks/use-reproducao";
import { ReproducaoDetailsDialog } from "@/components/reproducao/ReproducaoDetailsDialog";
import { ReproducaoEditDialog } from "@/components/reproducao/ReproducaoEditDialog";
import { ReproducaoUltrassomDialog } from "@/components/reproducao/ReproducaoUltrassomDialog";

const Reproducao = () => {
  const {
    reproducoes,
    filteredReproducoes,
    searchTerm,
    setSearchTerm,
    animalTipo,
    setAnimalTipo,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isUltrassomDialogOpen,
    setIsUltrassomDialogOpen,
    currentReproducao,
    handleViewReproducao,
    handleEditReproducao,
    handleUltrassom,
    handleDeleteReproducao,
    handleAddSuccess,
    handleEditSuccess,
    handleUltrassomSuccess
  } = useReproducao();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-farm">Reprodução Animal</h1>
        <p className="text-gray-500">Gerenciamento de reprodução do rebanho</p>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos" onClick={() => setAnimalTipo("todos")}>
            Todos
          </TabsTrigger>
          <TabsTrigger value="bovino" onClick={() => setAnimalTipo("bovino")}>
            Bovinos
          </TabsTrigger>
          <TabsTrigger value="equino" onClick={() => setAnimalTipo("equino")}>
            Equinos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="todos" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <ReproducaoHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddClick={() => setIsAddDialogOpen(true)}
              />
              <ReproducaoTable
                reproducoes={filteredReproducoes}
                onView={handleViewReproducao}
                onEdit={handleEditReproducao}
                onUltrassom={handleUltrassom}
                onDelete={handleDeleteReproducao}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bovino" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <ReproducaoHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddClick={() => setIsAddDialogOpen(true)}
                animalTipo="bovino"
              />
              <ReproducaoTable
                reproducoes={filteredReproducoes.filter(r => r.tipoAnimal === "bovino")}
                onView={handleViewReproducao}
                onEdit={handleEditReproducao}
                onUltrassom={handleUltrassom}
                onDelete={handleDeleteReproducao}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equino" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <ReproducaoHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddClick={() => setIsAddDialogOpen(true)}
                animalTipo="equino"
              />
              <ReproducaoTable
                reproducoes={filteredReproducoes.filter(r => r.tipoAnimal === "equino")}
                onView={handleViewReproducao}
                onEdit={handleEditReproducao}
                onUltrassom={handleUltrassom}
                onDelete={handleDeleteReproducao}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <ReproducaoAddDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
        animalTipo={animalTipo !== "todos" ? animalTipo : undefined}
      />

      <ReproducaoDetailsDialog
        reproducao={currentReproducao}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <ReproducaoEditDialog
        reproducao={currentReproducao}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <ReproducaoUltrassomDialog
        reproducao={currentReproducao}
        open={isUltrassomDialogOpen}
        onOpenChange={setIsUltrassomDialogOpen}
        onSuccess={handleUltrassomSuccess}
      />
    </div>
  );
};

export default Reproducao;
