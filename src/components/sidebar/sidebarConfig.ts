
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Calendar, 
  FileText, 
  Settings, 
  Users, 
  Activity, 
  Baby, 
  UsersIcon, 
  UserCog,
  Shield
} from "lucide-react";

export type SidebarLinkType = {
  icon: React.ElementType;
  label: string;
  to: string;
  requiredRole?: "admin" | "editor" | "viewer" | null; // Minimum role required to see this link
  roles?: Array<"admin" | "editor" | "viewer">; // Specific roles that can access this link
};

export type SidebarSectionType = {
  title?: string;
  links: SidebarLinkType[];
};

// Main application links available to all authenticated users
const mainLinks: SidebarLinkType[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Database, label: "Gestão de Gado", to: "/gestao-gado" },
  { icon: Users, label: "Gestão de Cavalos", to: "/gestao-cavalos" },
  { icon: Baby, label: "Reprodução Animal", to: "/reproducao" },
  { icon: Activity, label: "Histórico de Saúde", to: "/historico-saude" },
  { icon: BarChart3, label: "Relatórios", to: "/relatorios" },
  { icon: Calendar, label: "Calendário", to: "/calendario" },
  { icon: FileText, label: "Documentos", to: "/documentos" },
  { icon: Settings, label: "Configurações", to: "/configuracoes" },
];

// Links that only admin users can access
const adminLinks: SidebarLinkType[] = [
  { 
    icon: UsersIcon, 
    label: "Usuários", 
    to: "/admin/users", 
    requiredRole: "admin" 
  },
  { 
    icon: UserCog, 
    label: "Controle de Acesso", 
    to: "/admin/access-control", 
    requiredRole: "admin" 
  }
];

// Combined sidebar configuration with sections
export const sidebarConfig: SidebarSectionType[] = [
  {
    links: mainLinks
  },
  {
    title: "ADMINISTRAÇÃO",
    links: adminLinks
  }
];

// Helper functions for accessing sidebar links based on user role
export const filterLinksByRole = (
  links: SidebarLinkType[], 
  userRole: "admin" | "editor" | "viewer" | null
): SidebarLinkType[] => {
  if (!userRole) return [];

  return links.filter(link => {
    // If no role requirements are specified, show to all authenticated users
    if (!link.requiredRole && !link.roles) return true;
    
    // If specific roles are defined, check if user's role is included
    if (link.roles) {
      return link.roles.includes(userRole);
    }
    
    // Check if user meets the minimum required role
    if (link.requiredRole) {
      const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
      return roleHierarchy[userRole] >= roleHierarchy[link.requiredRole];
    }
    
    return true;
  });
};

// Get sections filtered by user role
export const getSidebarSectionsByRole = (
  userRole: "admin" | "editor" | "viewer" | null
): SidebarSectionType[] => {
  // Return empty array if no user role is provided
  if (!userRole) return [];
  
  // Filter each section's links based on the user's role
  return sidebarConfig
    .map(section => ({
      ...section,
      links: filterLinksByRole(section.links, userRole)
    }))
    // Only include sections that have at least one link after filtering
    .filter(section => section.links.length > 0);
};
