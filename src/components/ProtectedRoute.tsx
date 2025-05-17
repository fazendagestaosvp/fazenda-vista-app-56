
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  noViewers?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  noViewers = false 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isViewer } = useAuth();
  const location = useLocation();

  if (loading) {
    // Exibir um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para a página de login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota for apenas para admins e o usuário não for admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se a rota não permitir visualizadores e o usuário for visualizador
  if (noViewers && isViewer()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
