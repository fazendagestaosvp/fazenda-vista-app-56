
import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import { cn } from "@/lib/utils";
import SidebarLink from "./SidebarLink";
import SidebarTooltip from "./SidebarTooltip";
import { useAuth } from "@/hooks/useAuthContext";
import { sidebarLinks } from "./sidebarConfig";

type SidebarNavigationProps = {
  isSidebarOpen: boolean;
};

const SidebarNavigation = ({ isSidebarOpen }: SidebarNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const baseLinks = sidebarLinks.baseLinks;
  const adminLinks = sidebarLinks.adminLinks;

  return (
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
            <SidebarTooltip isVisible={!isSidebarOpen && hoverItem === link.to}>
              {link.label}
            </SidebarTooltip>
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
                <SidebarTooltip isVisible={!isSidebarOpen && hoverItem === link.to}>
                  {link.label}
                </SidebarTooltip>
              </div>
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
