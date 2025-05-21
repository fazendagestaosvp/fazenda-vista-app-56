
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
  UserCog 
} from "lucide-react";

export type SidebarLinkType = {
  icon: React.ElementType;
  label: string;
  to: string;
};

export const sidebarLinks = {
  baseLinks: [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Database, label: "Gestão de Gado", to: "/gestao-gado" },
    { icon: Users, label: "Gestão de Cavalos", to: "/gestao-cavalos" },
    { icon: Baby, label: "Reprodução Animal", to: "/reproducao" },
    { icon: Activity, label: "Histórico de Saúde", to: "/historico-saude" },
    { icon: BarChart3, label: "Relatórios", to: "/relatorios" },
    { icon: Calendar, label: "Calendário", to: "/calendario" },
    { icon: FileText, label: "Documentos", to: "/documentos" },
    { icon: Settings, label: "Configurações", to: "/configuracoes" },
  ],
  
  adminLinks: [
    { icon: UsersIcon, label: "Usuários", to: "/admin/users" },
    { icon: UserCog, label: "Controle de Acesso", to: "/admin/access-control" }
  ]
};
