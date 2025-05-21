
import { ReactNode } from "react";

type SidebarTooltipProps = {
  children: ReactNode;
  isVisible: boolean;
};

const SidebarTooltip = ({ children, isVisible }: SidebarTooltipProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-0 left-full ml-2 z-50 px-3 py-1 bg-card text-foreground rounded-md shadow-md whitespace-nowrap">
      {children}
    </div>
  );
};

export default SidebarTooltip;
