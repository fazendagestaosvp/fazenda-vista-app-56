
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";
import UserProfileMenu from "./UserProfileMenu";

const AppSidebarHelper = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Redirecionar para login se não estiver autenticado
    if (!loading && !user && mounted) {
      navigate("/login");
    }
  }, [user, loading, navigate, mounted]);

  // Não renderizar nada durante o carregamento inicial para evitar flash
  if (!mounted || loading) return null;

  return <UserProfileMenu />;
};

export default AppSidebarHelper;
