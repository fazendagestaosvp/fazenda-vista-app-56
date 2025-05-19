
export function useRoleChecks(userRole: "admin" | "user" | "viewer" | null) {
  // Verificar se o usuário é administrador
  const isAdmin = () => userRole === "admin";
  
  // Verificar se o usuário é apenas visualizador
  const isViewer = () => userRole === "viewer";

  return {
    isAdmin,
    isViewer
  };
}
