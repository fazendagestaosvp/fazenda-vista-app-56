
import { LayoutDashboard, Database, BarChart3, Calendar, FileText, Settings, X, Users, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
};

const SidebarLink = ({ icon: Icon, label, to, isActive }: SidebarLinkProps) => {
  return (
    <Link to={to} className={cn("sidebar-link", isActive && "active")}>
      <Icon size={20} className={isActive ? "text-farm" : "text-gray-600"} />
      <span>{label}</span>
    </Link>
  );
};

interface AppSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const AppSidebar = ({ isSidebarOpen, toggleSidebar }: AppSidebarProps) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Database, label: "Gestão de Gado", to: "/gestao-gado" },
    { icon: Users, label: "Gestão de Cavalos", to: "/gestao-cavalos" },
    { icon: Activity, label: "Histórico de Saúde", to: "/historico-saude" },
    { icon: BarChart3, label: "Relatórios", to: "/relatorios" },
    { icon: Calendar, label: "Calendário", to: "/calendario" },
    { icon: FileText, label: "Documentos", to: "/documentos" },
    { icon: Settings, label: "Configurações", to: "/configuracoes" },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <div className="farm-logo">FazendaPlus</div>
              <div className="farm-subtitle">Gestão Premium</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.to}
              icon={link.icon}
              label={link.label}
              to={link.to}
              isActive={link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
