
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import GestaoGado from "@/pages/GestaoGado";
import GestaoCavalos from "@/pages/GestaoCavalos";
import Reproducao from "@/pages/Reproducao";
import HistoricoSaude from "@/pages/HistoricoSaude";
import Relatorios from "@/pages/Relatorios";
import Calendario from "@/pages/Calendario";
import UserProfile from "@/pages/UserProfile";
import SecuritySettings from "@/pages/SecuritySettings";
import NotificationSettings from "@/pages/NotificationSettings";
import Documentos from "@/pages/Documentos";
import Dashboard from "@/pages/Dashboard";
import Configuracoes from "@/pages/Configuracoes";
import UserManagement from "@/pages/UserManagement";
import UserAccessControl from "@/pages/UserAccessControl";
import AdminPromote from "@/pages/AdminPromote";
import AdminPromoteViewer from "@/pages/AdminPromoteViewer";

// Criando um cliente do React Query para gerenciamento de estado e requisições
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Rotas protegidas (requer autenticação) */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="gestao-gado" element={<GestaoGado />} />
            <Route path="gestao-cavalos" element={<GestaoCavalos />} />
            <Route path="reproducao" element={<Reproducao />} />
            <Route path="historico-saude" element={<HistoricoSaude />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="documentos" element={<Documentos />} />
            
            {/* Configurações */}
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="configuracoes/perfil" element={<UserProfile />} />
            <Route path="configuracoes/seguranca" element={<SecuritySettings />} />
            <Route path="configuracoes/notificacoes" element={<NotificationSettings />} />
            
            {/* Rotas de administração */}
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/access-control" element={<UserAccessControl />} />
            <Route path="admin/promote" element={<AdminPromote />} />
            <Route path="admin/promote-viewer" element={<AdminPromoteViewer />} />
          </Route>
          
          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
