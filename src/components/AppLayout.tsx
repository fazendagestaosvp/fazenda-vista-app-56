
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Menu, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300">
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-10 w-64 bg-gray-50"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-farm hover:bg-farm-dark text-white">
                    <Plus size={16} className="mr-2" />
                    Adicionar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Adicionar Animal</DropdownMenuItem>
                  <DropdownMenuItem>Registrar Produção</DropdownMenuItem>
                  <DropdownMenuItem>Agendar Evento</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
