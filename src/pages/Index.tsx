
import { useAuth } from "@/hooks/useAuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  console.log("Index page - user:", user, "loading:", loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  // Página de boas-vindas para usuários não autenticados
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-farm-muted rounded-full flex items-center justify-center mx-auto">
            <span className="farm-logo">FP</span>
          </div>
          <h1 className="farm-logo text-4xl">FazendaPlus</h1>
          <p className="farm-subtitle text-xl">Gestão Premium de Fazendas</p>
          <p className="text-gray-600 max-w-md mx-auto">
            Sistema completo de gestão para sua fazenda. Controle seus animais, 
            acompanhe a saúde do rebanho e gerencie toda sua propriedade.
          </p>
          <div className="space-x-4">
            <a 
              href="/login" 
              className="inline-block bg-farm text-white px-6 py-3 rounded-lg hover:bg-farm-dark transition-colors"
            >
              Fazer Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Usuários autenticados são redirecionados automaticamente pelo ProtectedRoute no App.tsx
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
    </div>
  );
};

export default Index;
