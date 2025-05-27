
import { useAuth } from "@/hooks/useAuthContext";
import { Navigate } from "react-router-dom";

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

  if (user) {
    console.log("User authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User not authenticated, redirecting to login");
  return <Navigate to="/login" replace />;
};

export default Index;
