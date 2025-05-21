import { LayoutDashboard, Database, BarChart3, Calendar, FileText, Settings, Menu, Users, Activity, Baby, UsersIcon, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LogoutButton from "./LogoutButton";

type SidebarLinkProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  isSidebarOpen: boolean;
};

const SidebarLink = ({ icon: Icon, label, to, isActive, isSidebarOpen }: SidebarLinkProps) => {
  return (
    <Link to={to} className="w-full">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 transition-all duration-200", 
          isActive ? "bg-farm-muted text-farm font-medium" : "",
          !isSidebarOpen ? "px-2 h-10 flex justify-center" : ""
        )}
      >
        <Icon size={20} className={cn(isActive ? "text-farm" : "text-muted-foreground")} />
        {isSidebarOpen && <span className={isActive ? "font-medium text-foreground" : "font-normal text-muted-foreground"}>{label}</span>}
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
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const baseLinks = [
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
  
  const adminLinks = [
    { icon: UsersIcon, label: "Controle de Acesso", to: "/admin/access-control" }
  ];

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out rounded-r-lg shadow-lg",
        isSidebarOpen ? "w-64 bg-card border-r" : "w-[60px] bg-farm text-white"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={cn(
          "flex items-center p-4 border-b",
          !isSidebarOpen ? "justify-center border-farm-dark" : "justify-between"
        )}>
          {isSidebarOpen ? (
            <>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-farm rounded-full flex items-center justify-center text-white font-bold text-xs">FV</div>
                <h1 className="ml-2 text-xl font-bold text-farm">Fazenda Vista</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu size={18} />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-farm-dark">
              <Menu size={18} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className={cn("space-y-1", !isSidebarOpen ? "px-1" : "px-2")}>
            {baseLinks.map((link) => (
              <div 
                key={link.to}
                onMouseEnter={() => !isSidebarOpen && setHoverItem(link.to)}
                onMouseLeave={() => setHoverItem(null)}
                className="relative"
              >
                <SidebarLink
                  icon={link.icon}
                  label={link.label}
                  to={link.to}
                  isActive={
                    link.to === "/"
                      ? currentPath === "/"
                      : currentPath.startsWith(link.to)
                  }
                  isSidebarOpen={isSidebarOpen}
                />
                {/* Tooltip for collapsed sidebar */}
                {!isSidebarOpen && hoverItem === link.to && (
                  <div className="absolute top-0 left-full ml-2 z-50 px-3 py-1 bg-card text-foreground rounded-md shadow-md whitespace-nowrap">
                    {link.label}
                  </div>
                )}
              </div>
            ))}
            
            {/* Admin links - only visible for admins */}
            {isAdmin() && (
              <>
                {isSidebarOpen && (
                  <div className="pt-4 pb-2">
                    <div className="px-3">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Administração
                      </h3>
                    </div>
                  </div>
                )}
                
                {adminLinks.map((link) => (
                  <div 
                    key={link.to}
                    onMouseEnter={() => !isSidebarOpen && setHoverItem(link.to)}
                    onMouseLeave={() => setHoverItem(null)}
                    className="relative"
                  >
                    <SidebarLink
                      icon={link.icon}
                      label={link.label}
                      to={link.to}
                      isActive={currentPath.startsWith(link.to)}
                      isSidebarOpen={isSidebarOpen}
                    />
                    {/* Tooltip for collapsed sidebar */}
                    {!isSidebarOpen && hoverItem === link.to && (
                      <div className="absolute top-0 left-full ml-2 z-50 px-3 py-1 bg-card text-foreground rounded-md shadow-md whitespace-nowrap">
                        {link.label}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Logout Button */}
        <div className={cn(
          "px-2 py-3",
          !isSidebarOpen ? "flex justify-center" : ""
        )}>
          <LogoutButton 
            variant={isSidebarOpen ? "destructive" : "ghost"}
            className={cn(
              "w-full gap-2", 
              !isSidebarOpen ? "h-10 w-10 p-0" : "",
              !isSidebarOpen ? "text-white hover:bg-farm-dark" : ""
            )}
            redirectTo="/login"
            showIcon={true}
            onLogoutSuccess={() => {
              toast({
                title: "Logout realizado",
                description: "Você saiu da sua conta com sucesso."
              });
            }}
          >
            {isSidebarOpen && <span>Sair</span>}
          </LogoutButton>
        </div>

        {/* Footer */}
        <div className={cn(
          "p-3 border-t", 
          !isSidebarOpen ? "border-farm-dark" : ""
        )}>
          {isSidebarOpen ? (
            <p className="text-xs text-gray-500">Desenvolvido por JPDev.</p>
          ) : (
            <div className="flex justify-center">
              <div className="w-6 h-6 bg-farm-light opacity-50 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">JP</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
