
import { useAuth } from "@/hooks/useAuthContext";
import { 
  ConfiguracoesDebugInfo, 
  BasicSettingsGrid, 
  UserControlPanel, 
  AdminAdvancedSection 
} from "@/components/configuracoes";

const Configuracoes = () => {
  const { userRole, isAdmin, loading, user } = useAuth();

  console.log("=== DEBUG CONFIGURAÇÕES ===");
  console.log("UserRole em Configuracoes:", userRole);
  console.log("Loading:", loading);
  console.log("isAdmin function result:", isAdmin());
  console.log("User email:", user?.email);
  console.log("===========================");
  
  const isAdminUser = userRole === "admin";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta.
        </p>
      </div>

      <ConfiguracoesDebugInfo />

      {/* Grid de configurações principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <BasicSettingsGrid />
        
        {/* Card de Controle de Usuários para Admin */}
        {isAdminUser && (
          <UserControlPanel isAdminUser={isAdminUser} />
        )}
      </div>

      {/* Seção de Controle de Usuários expandida para Admin */}
      {isAdminUser && <AdminAdvancedSection />}
    </div>
  );
};

export default Configuracoes;
