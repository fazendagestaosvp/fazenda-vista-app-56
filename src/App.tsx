
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "./components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Animais from "./pages/Animais";
import GestaoGado from "./pages/GestaoGado";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";
import UserProfile from "./pages/UserProfile";
import SecuritySettings from "./pages/SecuritySettings";
import NotificationSettings from "./pages/NotificationSettings";
import Relatorios from "./pages/Relatorios";
import Reproducao from "./pages/Reproducao";
import HistoricoSaude from "./pages/HistoricoSaude";
import Documentos from "./pages/Documentos";
import GestaoCavalos from "./pages/GestaoCavalos";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AdminPromote from "./pages/AdminPromote";
import AdminPromoteViewer from "./pages/AdminPromoteViewer";
import UserRoleManagement from "./pages/UserRoleManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="animais" element={<Animais />} />
            <Route path="gestao-gado" element={<GestaoGado />} />
            <Route path="gestao-cavalos" element={<GestaoCavalos />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="configuracoes/perfil" element={<UserProfile />} />
            <Route path="configuracoes/seguranca" element={<SecuritySettings />} />
            <Route path="configuracoes/notificacoes" element={<NotificationSettings />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="reproducao" element={<Reproducao />} />
            <Route path="historico-saude" element={<HistoricoSaude />} />
            <Route path="documentos" element={<Documentos />} />
            <Route 
              path="admin/promote" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPromote />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/promote-viewer" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPromoteViewer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserRoleManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
