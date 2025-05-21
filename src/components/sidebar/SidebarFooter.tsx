
import { cn } from "@/lib/utils";

type SidebarFooterProps = {
  isSidebarOpen: boolean;
};

const SidebarFooter = ({ isSidebarOpen }: SidebarFooterProps) => {
  return (
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
  );
};

export default SidebarFooter;
