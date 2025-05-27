
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

interface ProtectedRouteProps {
  children?: ReactNode;
  adminOnly?: boolean;
  noViewers?: boolean;
  editorsOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  noViewers = false,
  editorsOnly = false
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isViewer, isEditor } = useSimpleAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (editorsOnly && !isAdmin() && !isEditor()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (noViewers && isViewer()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
