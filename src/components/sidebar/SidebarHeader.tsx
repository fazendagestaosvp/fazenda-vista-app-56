
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

type SidebarHeaderProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarHeader = ({ isSidebarOpen, toggleSidebar }: SidebarHeaderProps) => {
  return (
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
  );
};

export default SidebarHeader;
