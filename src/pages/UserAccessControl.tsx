
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, Shield, UserIcon, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserWithRole = {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
};

const UserAccessControl = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
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
      
      // Buscar usuários e seus papéis
      const { data: usersData, error: usersError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role
        `);
        
      if (usersError) throw usersError;
      
      // Buscar informações dos usuários do auth.users
      // Como não podemos acessar diretamente auth.users via API,
      // usaríamos uma função RPC ou Edge Function aqui
      // Por enquanto, simulamos com emails baseados no ID
      
      const formattedUsers = usersData.map(user => {
        // Map database role to UI role
        let uiRole: "admin" | "editor" | "viewer" = user.role === "user" ? "editor" : user.role as "admin" | "viewer";
        
        return {
          id: user.user_id,
          email: `user-${user.user_id.substring(0, 8)}@example.com`, // simulado
          role: uiRole
        };
      });
      
      setUsers(formattedUsers);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar usuários baseado na pesquisa e filtro de papel
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'user':
        return <Badge className="bg-green-500">Editor</Badge>;
      case 'viewer':
        return <Badge className="bg-blue-500">Visualizador</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'user':
        return <UserIcon className="h-4 w-4 mr-1" />;
      case 'viewer':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <UserIcon className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-4">Controle de Acesso de Usuários</h2>
      <p className="text-muted-foreground mb-6">
        Gerencie os papéis e permissões dos usuários no sistema.
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
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Buscar por email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select 
                    value={roleFilter} 
                    onValueChange={setRoleFilter}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar por papel" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os papéis</SelectItem>
                      <SelectItem value="admin">Administradores</SelectItem>
                      <SelectItem value="user">Editores</SelectItem>
                      <SelectItem value="viewer">Visualizadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between mb-4 gap-2">
                <div className="space-x-2">
                  <Button variant="outline" onClick={fetchUsers} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => navigate('/admin/promote')} className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700">
                    Promover Admin
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/admin/promote-editor')} className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700">
                    Promover Editor
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/admin/promote-viewer')} className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                    Promover Visualizador
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Permissões</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              {getRoleBadge(user.role)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.role === 'admin' ? (
                              <span className="text-sm text-muted-foreground">Acesso total ao sistema</span>
                            ) : user.role === 'user' ? (
                              <span className="text-sm text-muted-foreground">Pode editar e gerenciar dados</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Apenas visualização</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          {searchTerm || roleFilter !== "all" 
                            ? "Nenhum usuário encontrado com os critérios de busca" 
                            : "Nenhum usuário cadastrado"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
