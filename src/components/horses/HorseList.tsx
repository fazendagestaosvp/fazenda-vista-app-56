
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HorseStatusBadge } from "./HorseStatusBadge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface HorseListProps {
  horses: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onOpenAddDialog: () => void;
  onOpenHorseDetails: (horse: any) => void;
  // Pagination props
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

export function HorseList({
  horses,
  searchTerm,
  setSearchTerm,
  onOpenAddDialog,
  onOpenHorseDetails,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  indexOfFirstItem,
  indexOfLastItem
}: HorseListProps) {
  // Filter horses based on search term
  const filteredHorses = horses.filter(
    (horse) =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current horses for the page
  const currentHorses = filteredHorses.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-farm">Lista de Cavalos</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Buscar cavalos..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-farm hover:bg-farm-dark"
              onClick={onOpenAddDialog}
            >
              <Plus size={16} className="mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentHorses.map((horse) => (
              <TableRow key={horse.id}>
                <TableCell className="font-medium">{horse.id}</TableCell>
                <TableCell>{horse.name}</TableCell>
                <TableCell>{horse.breed}</TableCell>
                <TableCell>{horse.age} anos</TableCell>
                <TableCell>{horse.color}</TableCell>
                <TableCell>{horse.gender}</TableCell>
                <TableCell><HorseStatusBadge status={horse.status} /></TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenHorseDetails(horse)}
                  >
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Show pagination if there's more than one page */}
        {totalPages > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }} 
                    />
                  </PaginationItem>
                )}
                
                {getPageNumbers().map((page, index) => {
                  if (page === "ellipsis-start" || page === "ellipsis-end") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }} 
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-2 text-center">
          Mostrando {Math.min(filteredHorses.length, indexOfFirstItem + 1)}-{Math.min(indexOfLastItem, filteredHorses.length)} de {filteredHorses.length} cavalos
        </div>
      </CardContent>
    </Card>
  );
}
