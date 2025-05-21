
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, Shield, User, Search, Loader2 } from "lucide-react";
import { DbRole, UiRole, dbToUiRole } from "@/types/user.types";
import { Input } from "@/components/ui/input";

type UserWithRole = {
  id: string;
  email: string;
  role: UiRole;
};

const UserAccessControl = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se é admin e redirecionar se não for
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate, toast]);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filtrar usuários baseado no termo de busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
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
        setFilteredUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao buscar usuários",
        description: "Ocorreu um erro ao carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'editor':
        return <Badge className="bg-green-500">Editor</Badge>;
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
      case 'editor':
        return <User className="h-4 w-4 mr-1" />;
      case 'viewer':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };
  
  // Function to promote a user to admin
  const promoteToAdmin = async (userId: string) => {
    try {
      await supabase.rpc('promote_to_admin', { email: users.find(u => u.id === userId)?.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Administrador com sucesso."
      });
      fetchUsers(); // Refresh user list
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
      await supabase.rpc('promote_to_editor', { email: users.find(u => u.id === userId)?.email });
      toast({
        title: "Usuário promovido",
        description: "O usuário foi promovido a Editor com sucesso."
      });
      fetchUsers(); // Refresh user list
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
      await supabase.rpc('promote_to_viewer', { email: users.find(u => u.id === userId)?.email });
      toast({
        title: "Usuário alterado",
        description: "O usuário foi configurado como Visualizador com sucesso."
      });
      fetchUsers(); // Refresh user list
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar usuário",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controle de Acesso</h2>
        <p className="text-muted-foreground">
          Gerencie os níveis de acesso dos usuários no sistema.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários e Permissões</CardTitle>
          <CardDescription>
            Promova ou altere o nível de acesso dos usuários no sistema
          </CardDescription>
          <div className="flex items-center mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuário por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-farm" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2">
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      {searchTerm ? "Nenhum usuário encontrado com este email" : "Nenhum usuário encontrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
