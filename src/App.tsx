
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Animais from "./pages/Animais";
import GestaoGado from "./pages/GestaoGado";
import GestaoCavalos from "./pages/GestaoCavalos";
import HistoricoSaude from "./pages/HistoricoSaude";
import Reproducao from "./pages/Reproducao";
import Relatorios from "./pages/Relatorios";
import Documentos from "./pages/Documentos";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";
import UserProfile from "./pages/UserProfile";
import SecuritySettings from "./pages/SecuritySettings";
import NotificationSettings from "./pages/NotificationSettings";
import UserManagement from "./pages/UserManagement";
import UserAccessControl from "./pages/UserAccessControl";
import UserRoleManagement from "./pages/UserRoleManagement";
import AdminRoleManagement from "./pages/AdminRoleManagement";
import AdminPromote from "./pages/AdminPromote";
import AdminPromoteEditor from "./pages/AdminPromoteEditor";
import AdminPromoteViewer from "./pages/AdminPromoteViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useSimpleAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <Index /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes with layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/animais" element={
        <ProtectedRoute>
          <AppLayout>
            <Animais />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gestao-gado" element={
        <ProtectedRoute>
          <AppLayout>
            <GestaoGado />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gestao-cavalos" element={
        <ProtectedRoute>
          <AppLayout>
            <GestaoCavalos />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/historico-saude" element={
        <ProtectedRoute>
          <AppLayout>
            <HistoricoSaude />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reproducao" element={
        <ProtectedRoute>
          <AppLayout>
            <Reproducao />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/relatorios" element={
        <ProtectedRoute>
          <AppLayout>
            <Relatorios />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/documentos" element={
        <ProtectedRoute>
          <AppLayout>
            <Documentos />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/calendario" element={
        <ProtectedRoute>
          <AppLayout>
            <Calendario />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <AppLayout>
            <Configuracoes />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/user-profile" element={
        <ProtectedRoute>
          <AppLayout>
            <UserProfile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/security-settings" element={
        <ProtectedRoute>
          <AppLayout>
            <SecuritySettings />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/notification-settings" element={
        <ProtectedRoute>
          <AppLayout>
            <NotificationSettings />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/user-management" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <UserManagement />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/user-access-control" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <UserAccessControl />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/user-role-management" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <UserRoleManagement />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin-role-management" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <AdminRoleManagement />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin-promote" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <AdminPromote />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin-promote-editor" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <AdminPromoteEditor />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin-promote-viewer" element={
        <ProtectedRoute adminOnly>
          <AppLayout>
            <AdminPromoteViewer />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
