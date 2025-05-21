import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, Shield, User } from "lucide-react";
import { DbRole, UiRole, dbToUiRole } from "@/types/user.types";

type UserWithRole = {
  id: string;
  email: string;
  role: UiRole;
};

const UserRoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!isAdmin()) {
    navigate("/dashboard");
    return null;
  }
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, user_roles(role)')
        .order('email');

      if (error) throw error;

      if (data) {
        const usersWithRoles = data.map((user: any) => {
          // Map DB role to UI role for consistency
          const dbRole = user.user_roles?.role as DbRole || 'viewer';
          const uiRole = dbToUiRole(dbRole);

          return {
            id: user.id,
            email: user.email,
            role: uiRole,
          };
        });

        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'viewer':
        return <Badge className="bg-blue-500">Visualizador</Badge>;
      default:
        return <Badge>Usuário</Badge>;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'viewer':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Gerenciamento de Usuários</h2>
      <p className="text-muted-foreground mb-6">
        Visualize e gerencie os papéis dos usuários no sistema.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários e Permissões</CardTitle>
          <CardDescription>
            Lista de todos os usuários e seus respectivos papéis no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4 space-x-2">
                <Button variant="outline" onClick={() => navigate('/admin/promote')}>
                  Promover Admin
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/promote-viewer')}>
                  Promover Visualizador
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Papel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            {getRoleBadge(user.role)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManagement;
