import { useState, useEffect, ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Menu, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  console.log("AppLayout rendering - should NOT create any Router");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Verificar se há preferência salva no localStorage
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? savedState === 'open' : true; // Padrão é aberto
  });
  
  const location = useLocation();

  useEffect(() => {
    // Salvar estado no localStorage sempre que mudar
    localStorage.setItem('sidebarState', isSidebarOpen ? 'open' : 'closed');
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen">
      <AppSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300", 
        isSidebarOpen ? "lg:pl-64" : "lg:pl-[60px]"
      )}>
        <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-30">
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
                  className="pl-10 w-64 bg-gray-50/90"
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
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
