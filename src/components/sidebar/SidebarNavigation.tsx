
import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import { cn } from "@/lib/utils";
import SidebarLink from "./SidebarLink";
import SidebarTooltip from "./SidebarTooltip";
import { useAuth } from "@/hooks/useAuthContext";
import { getSidebarSectionsByRole } from "./sidebarConfig";

type SidebarNavigationProps = {
  isSidebarOpen: boolean;
};

const SidebarNavigation = ({ isSidebarOpen }: SidebarNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const { userRole } = useAuth();
  
  // Obter seções da barra lateral filtradas pelo papel do usuário
  const sidebarSections = getSidebarSectionsByRole(userRole);

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      <nav className={cn("space-y-1", !isSidebarOpen ? "px-1" : "px-2")}>
        {sidebarSections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="mb-4">
            {/* Exibir título da seção somente se existir e a barra lateral estiver aberta */}
            {section.title && isSidebarOpen && (
              <div className="px-3 pt-4 pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            
            {section.links.map((link) => (
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
                <SidebarTooltip isVisible={!isSidebarOpen && hoverItem === link.to}>
                  {link.label}
                </SidebarTooltip>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
