
import { useAuth } from "@/hooks/useAuthContext";
import { 
  ConfiguracoesDebugInfo, 
  BasicSettingsGrid, 
  UserControlPanel, 
  AdminAdvancedSection 
} from "@/components/configuracoes";

const Configuracoes = () => {
  const { userRole, isAdmin, loading } = useAuth();

  console.log("=== DEBUG CONFIGURAÇÕES ===");
  console.log("UserRole em Configuracoes:", userRole);
  console.log("Loading:", loading);
  console.log("isAdmin function result:", isAdmin());
  console.log("Type of userRole:", typeof userRole);
  console.log("===========================");
  
  // Verificação usando o tipo UiRole correto
  const isAdminUser = userRole === "admin";
  
  console.log("isAdminUser (direct comparison):", isAdminUser);
  console.log("isAdmin() function:", isAdmin());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta.
        </p>
      </div>

      <ConfiguracoesDebugInfo />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BasicSettingsGrid />
        <UserControlPanel isAdminUser={isAdminUser} />
        {isAdminUser && <AdminAdvancedSection />}
      </div>
    </div>
  );
};

export default Configuracoes;
