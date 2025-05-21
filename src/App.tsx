
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from './components/AppLayout';
import { AuthProvider } from './hooks/useAuthContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import GestaoGado from './pages/GestaoGado';
import GestaoCavalos from './pages/GestaoCavalos';
import Reproducao from './pages/Reproducao';
import HistoricoSaude from './pages/HistoricoSaude';
import Relatorios from './pages/Relatorios';
import Calendario from './pages/Calendario';
import Documentos from './pages/Documentos';
import Configuracoes from './pages/Configuracoes';
import UserProfile from './pages/UserProfile';
import NotificationSettings from './pages/NotificationSettings';
import SecuritySettings from './pages/SecuritySettings';
import UserManagement from './pages/UserManagement';
import UserAccessControl from './pages/UserAccessControl';
import AdminPromote from './pages/AdminPromote';
import AdminPromoteViewer from './pages/AdminPromoteViewer';
import AdminPromoteEditor from './pages/AdminPromoteEditor';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/gestao-gado" element={<GestaoGado />} />
                <Route path="/gestao-cavalos" element={<GestaoCavalos />} />
                <Route path="/reproducao" element={<Reproducao />} />
                <Route path="/historico-saude" element={<HistoricoSaude />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/calendario" element={<Calendario />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/configuracoes/perfil" element={<UserProfile />} />
                <Route path="/configuracoes/seguranca" element={<SecuritySettings />} />
                <Route path="/configuracoes/notificacoes" element={<NotificationSettings />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/access-control" element={<UserAccessControl />} />
                <Route path="/admin/promote" element={<AdminPromote />} />
                <Route path="/admin/promote-editor" element={<AdminPromoteEditor />} />
                <Route path="/admin/promote-viewer" element={<AdminPromoteViewer />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
