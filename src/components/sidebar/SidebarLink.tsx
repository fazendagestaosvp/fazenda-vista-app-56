
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export default SidebarLink;
