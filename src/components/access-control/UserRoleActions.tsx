
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { UserWithRole } from "./types";

type UserRoleActionsProps = {
  user: UserWithRole;
  onRoleChange: () => void;
};

const UserRoleActions = ({ user, onRoleChange }: UserRoleActionsProps) => {
  // Function to promote a user to admin
  const promoteToAdmin = async (userId: string) => {
    try {
      await supabase.rpc('promote_to_admin', { email: user.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Administrador com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao promover usuário",
        variant: "destructive"
      });
    }
  };
  
  // Function to promote a user to editor (common user)
  const promoteToEditor = async (userId: string) => {
    try {
      // In database, 'editor' is stored as 'user'
      await supabase.rpc('promote_to_editor', { email: user.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Editor com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao promover usuário",
        variant: "destructive"
      });
    }
  };
  
  // Function to promote a user to viewer
  const promoteToViewer = async (userId: string) => {
    try {
      await supabase.rpc('promote_to_viewer', { email: user.email });
      toast({
        title: "Usuário alterado",
        description: "O usuário foi configurado como Visualizador com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar usuário",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-x-2">
      {user.role !== 'admin' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => promoteToAdmin(user.id)}
          className="bg-red-100 hover:bg-red-200 mr-1"
        >
          Administrador
        </Button>
      )}
      {user.role !== 'editor' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => promoteToEditor(user.id)}
          className="bg-green-100 hover:bg-green-200 mr-1"
        >
          Editor
        </Button>
      )}
      {user.role !== 'viewer' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => promoteToViewer(user.id)}
          className="bg-blue-100 hover:bg-blue-200"
        >
          Visualizador
        </Button>
      )}
    </div>
  );
};

export default UserRoleActions;
