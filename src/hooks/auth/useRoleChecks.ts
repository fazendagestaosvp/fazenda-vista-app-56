
export function useRoleChecks(userRole: "admin" | "editor" | "viewer" | null) {
  // Verificar se o usuário é administrador
  const isAdmin = () => userRole === "admin";
  
  // Verificar se o usuário é apenas visualizador
  const isViewer = () => userRole === "viewer";

  // Verificar se o usuário é editor
  const isEditor = () => userRole === "editor";
  
  // Verificar se o usuário pode editar (admin ou editor)
  const canEdit = () => userRole === "admin" || userRole === "editor";

  // Verificar se o usuário tem acesso a uma determinada página baseada no nível mínimo
  const hasAccessLevel = (minimumLevel: "admin" | "editor" | "viewer") => {
    if (!userRole) return false;
    
    if (minimumLevel === "admin") {
      return isAdmin();
    } else if (minimumLevel === "editor") {
      return isAdmin() || isEditor();
    } else {
      return true; // todos os usuários logados podem acessar páginas de nível "viewer"
    }
  };

  return {
    isAdmin,
    isViewer,
    isEditor,
    canEdit,
    hasAccessLevel
  };
}
