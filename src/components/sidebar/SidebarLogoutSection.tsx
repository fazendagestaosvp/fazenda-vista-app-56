
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";

type SidebarLogoutSectionProps = {
  isSidebarOpen: boolean;
};

const SidebarLogoutSection = ({ isSidebarOpen }: SidebarLogoutSectionProps) => {
  const { toast } = useToast();

  return (
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
  );
};

export default SidebarLogoutSection;
