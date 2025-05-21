
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserWithRole } from "./types";
import { useState } from "react";
import { Shield, User, Eye } from "lucide-react";

type UserRoleActionsProps = {
  user: UserWithRole;
  onRoleChange: () => void;
};

const UserRoleActions = ({ user, onRoleChange }: UserRoleActionsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to promote a user to admin
  const promoteToAdmin = async () => {
    if (user.role === 'admin') return; // Já possui este papel
    setIsLoading(true);
    
    try {
      await supabase.rpc('promote_to_admin', { email: user.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Administrador com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      console.error("Erro ao promover para administrador:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao promover usuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to promote a user to editor
  const promoteToEditor = async () => {
    if (user.role === 'editor') return; // Já possui este papel
    setIsLoading(true);
    
    try {
      // In database, 'editor' is stored as 'user'
      await supabase.rpc('promote_to_editor', { email: user.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Editor com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      console.error("Erro ao promover para editor:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao promover usuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to promote a user to viewer
  const promoteToViewer = async () => {
    if (user.role === 'viewer') return; // Já possui este papel
    setIsLoading(true);
    
    try {
      await supabase.rpc('promote_to_viewer', { email: user.email });
      toast({
        title: "Usuário alterado",
        description: "O usuário foi configurado como Visualizador com sucesso."
      });
      onRoleChange();
    } catch (error: any) {
      console.error("Erro ao alterar para visualizador:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar usuário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={user.role === 'admin' ? "default" : "outline"}
        size="sm"
        onClick={promoteToAdmin}
        disabled={isLoading || user.role === 'admin'}
        className={`${user.role === 'admin' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-100 hover:bg-red-200 text-red-800'}`}
      >
        <Shield className="h-4 w-4 mr-1" />
        Administrador
      </Button>
      
      <Button 
        variant={user.role === 'editor' ? "default" : "outline"}
        size="sm"
        onClick={promoteToEditor}
        disabled={isLoading || user.role === 'editor'}
        className={`${user.role === 'editor' ? 'bg-green-500 hover:bg-green-600' : 'bg-green-100 hover:bg-green-200 text-green-800'}`}
      >
        <User className="h-4 w-4 mr-1" />
        Editor
      </Button>
      
      <Button 
        variant={user.role === 'viewer' ? "default" : "outline"}
        size="sm"
        onClick={promoteToViewer}
        disabled={isLoading || user.role === 'viewer'}
        className={`${user.role === 'viewer' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
      >
        <Eye className="h-4 w-4 mr-1" />
        Visualizador
      </Button>
    </div>
  );
};

export default UserRoleActions;
