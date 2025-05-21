
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserAccessControl = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  
  console.log("UserRole em UserAccessControl:", userRole);
  
  // Verificar se é admin e redirecionar se não for
  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast]);
  
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
      setError(null);
      
      // Buscar perfis de usuários (sem o campo email que não existe na tabela)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .order('id');

      if (profilesError) throw profilesError;
      
      // Buscar emails dos usuários usando a função get_user_emails
      const userIds = profiles.map((profile: any) => profile.id);
      
      // Usar a função do Supabase para obter emails para esses usuários
      const { data: userEmails, error: emailsError } = await supabase.rpc(
        'get_user_emails',
        { user_ids: userIds }
      );
      
      if (emailsError) {
        console.error("Erro ao buscar emails dos usuários:", emailsError);
        throw emailsError;
      }

      // Buscar roles de usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (rolesError && rolesError.code !== 'PGRST116') {
        console.error("Erro ao buscar papéis dos usuários:", rolesError);
      }

      if (profiles && userEmails) {
        const usersWithRoles = userEmails.map((userEmail: any) => {
          // Encontrar o role do usuário, se existir
          const userRole = userRoles?.find(role => role.user_id === userEmail.id);
          const dbRole = userRole?.role as DbRole || 'viewer';
          const uiRole = dbToUiRole(dbRole);

          return {
            id: userEmail.id,
            email: userEmail.email,
            role: uiRole,
          };
        });

        console.log("Usuários encontrados:", usersWithRoles.length);
        setUsers(usersWithRoles);
        setFilteredUsers(usersWithRoles);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || "Ocorreu um erro ao carregar a lista de usuários");
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
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar usuários</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={fetchUsers}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <UserRolesTable 
              users={filteredUsers}
              loading={loading}
              onRoleChange={fetchUsers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessControl;
