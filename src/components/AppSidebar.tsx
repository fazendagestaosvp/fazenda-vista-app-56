import { LayoutDashboard, Database, BarChart3, Calendar, FileText, Settings, X, Users, Activity, Baby } from "lucide-react";
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
    <Link to={to} className="w-full">
      <Button variant="ghost" className={cn("w-full justify-start gap-2", isActive && "bg-muted")}>
        <Icon size={20} className={isActive ? "text-farm" : "text-muted-foreground"} />
        <span className={isActive ? "font-medium text-foreground" : "font-normal text-muted-foreground"}>{label}</span>
      </Button>
    </Link>
  );
};

type AppSidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const AppSidebar = ({ isSidebarOpen, toggleSidebar }: AppSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Database, label: "Gestão de Gado", to: "/gestao-gado" },
    { icon: Users, label: "Gestão de Cavalos", to: "/gestao-cavalos" },
    { icon: Baby, label: "Reprodução Animal", to: "/reproducao" },
    { icon: Activity, label: "Histórico de Saúde", to: "/historico-saude" },
    { icon: BarChart3, label: "Relatórios", to: "/relatorios" },
    { icon: Calendar, label: "Calendário", to: "/calendario" },
    { icon: FileText, label: "Documentos", to: "/documentos" },
    { icon: Settings, label: "Configurações", to: "/configuracoes" },
  ];

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-40 h-full bg-card border-r transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-farm rounded-full flex items-center justify-center text-white font-bold text-xs">FV</div>
            {isSidebarOpen && (
              <h1 className="ml-2 text-xl font-bold text-farm">Fazenda Vista</h1>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:flex hidden">
            <X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.to}
                icon={link.icon}
                label={link.label}
                to={link.to}
                isActive={
                  link.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(link.to)
                }
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t">
          <p className="text-xs text-gray-500">Desenvolvido por JPDev.</p>
        </div>
      </div>
    </div>
  );
};
