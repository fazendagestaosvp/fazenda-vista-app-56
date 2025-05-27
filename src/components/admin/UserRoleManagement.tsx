
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, User, Eye, RefreshCw } from "lucide-react";
import { useRoleManagement, UserWithRole, UserRoleType } from "@/hooks/role-management";
import { VisualizadorPermissionsDialog } from "./VisualizadorPermissionsDialog";

const UserRoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const { toast } = useToast();
  const { userRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { loading, fetchUsersWithRoles, updateUserRole } = useRoleManagement();
  
  // Verificar se é admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast, isAdmin]);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    const usersData = await fetchUsersWithRoles();
    setUsers(usersData);
  };
  
  const handleRoleChange = async (userId: string, newRole: UserRoleType) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      await loadUsers(); // Recarregar lista
    }
  };

  const handleManagePermissions = (user: UserWithRole) => {
    if (user.role === 'VISUALIZADOR') {
      setSelectedUser(user);
      setShowPermissionsDialog(true);
    }
  };
  
  const getRoleBadge = (role: UserRoleType) => {
    switch(role) {
      case 'ADM':
        return <Badge className="bg-red-500 text-white">Administrador</Badge>;
      case 'VISUALIZADOR':
        return <Badge className="bg-blue-500 text-white">Visualizador</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Editor</Badge>;
    }
  };
  
  const getRoleIcon = (role: UserRoleType) => {
    switch(role) {
      case 'ADM':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'VISUALIZADOR':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os papéis e permissões dos usuários no sistema.
          </p>
        </div>
        <Button onClick={loadUsers} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuários e Permissões</CardTitle>
          <CardDescription>
            Altere os papéis dos usuários e gerencie permissões específicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel Atual</TableHead>
                  <TableHead>Novo Papel</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name || 'Sem nome'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as UserRoleType)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADM">Administrador</SelectItem>
                            <SelectItem value="EDITOR">Editor</SelectItem>
                            <SelectItem value="VISUALIZADOR">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {user.role === 'VISUALIZADOR' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManagePermissions(user)}
                          >
                            Gerenciar Permissões
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <VisualizadorPermissionsDialog
          open={showPermissionsDialog}
          onOpenChange={setShowPermissionsDialog}
          user={selectedUser}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
};

export default UserRoleManagement;
