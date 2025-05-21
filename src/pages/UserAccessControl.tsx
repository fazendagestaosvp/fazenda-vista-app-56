
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { DbRole, dbToUiRole } from "@/types/user.types";
import { UserWithRole } from "@/components/access-control/types";
import UserSearchInput from "@/components/access-control/UserSearchInput";
import UserRolesTable from "@/components/access-control/UserRolesTable";

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
            <UserSearchInput 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardContent>
          <UserRolesTable 
            users={filteredUsers}
            loading={loading}
            onRoleChange={fetchUsers}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
