
export function useRoleChecks(userRole: "admin" | "editor" | "viewer" | null) {
  // Verificar se o usuário é administrador
  const isAdmin = () => userRole === "admin";
  
  // Verificar se o usuário é apenas visualizador
  const isViewer = () => userRole === "viewer";

  // Verificar se o usuário é editor
  const isEditor = () => userRole === "editor";

  return {
    isAdmin,
    isViewer,
    isEditor
  };
}
