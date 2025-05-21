
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
  const [activeRole, setActiveRole] = useState(user.role);
  
  const updateUserRole = async (newRole: string) => {
    if (newRole === activeRole) return; // Skip if role hasn't changed
    setIsLoading(true);
    
    try {
      console.log(`Mudando papel do usuário ${user.email} para: ${newRole}`);
      
      // Check which function to call based on the new role
      let result;
      if (newRole === 'admin') {
        result = await supabase.rpc('promote_to_admin', { email: user.email });
      } else if (newRole === 'editor') {
        result = await supabase.rpc('promote_to_editor', { email: user.email });
      } else if (newRole === 'viewer') {
        result = await supabase.rpc('promote_to_viewer', { email: user.email });
      }
      
      if (result?.error) {
        throw result.error;
      }
      
      // Update local state
      setActiveRole(newRole);
      
      // Show success message
      toast({
        title: "Papel atualizado",
        description: `O papel do usuário foi alterado para ${
          newRole === 'admin' ? 'Administrador' : 
          newRole === 'editor' ? 'Editor' : 'Visualizador'
        } com sucesso.`
      });
      
      // Refresh the user list
      onRoleChange();
    } catch (error: any) {
      console.error(`Erro ao atualizar papel para ${newRole}:`, error);
      toast({
        title: "Erro",
        description: error.message || `Erro ao atualizar papel do usuário para ${newRole}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={activeRole === 'admin' ? "default" : "outline"}
        size="sm"
        onClick={() => updateUserRole('admin')}
        disabled={isLoading || activeRole === 'admin'}
        className={`${activeRole === 'admin' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-100 hover:bg-red-200 text-red-800'}`}
      >
        <Shield className="h-4 w-4 mr-1" />
        Administrador
      </Button>
      
      <Button 
        variant={activeRole === 'editor' ? "default" : "outline"}
        size="sm"
        onClick={() => updateUserRole('editor')}
        disabled={isLoading || activeRole === 'editor'}
        className={`${activeRole === 'editor' ? 'bg-green-500 hover:bg-green-600' : 'bg-green-100 hover:bg-green-200 text-green-800'}`}
      >
        <User className="h-4 w-4 mr-1" />
        Editor
      </Button>
      
      <Button 
        variant={activeRole === 'viewer' ? "default" : "outline"}
        size="sm"
        onClick={() => updateUserRole('viewer')}
        disabled={isLoading || activeRole === 'viewer'}
        className={`${activeRole === 'viewer' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
      >
        <Eye className="h-4 w-4 mr-1" />
        Visualizador
      </Button>
    </div>
  );
};

export default UserRoleActions;
