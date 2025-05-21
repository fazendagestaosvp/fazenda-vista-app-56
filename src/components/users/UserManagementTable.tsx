
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchUsers, removeUser } from "@/services/user/userManagementService";
import UserTableHeader from "./management/UserTableHeader";
import UsersTable from "./management/UsersTable";
import DeleteUserDialog from "./management/DeleteUserDialog";
import UserAddDialog from "./UserAddDialog";
import UserEditDialog from "./UserEditDialog";

// Define the User interface locally to match what's returned from fetchUsers
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState<boolean>(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const result = await fetchUsers();
    
    if (result.success) {
      setUsers(result.data as User[]);
    } else {
      toast({
        title: "Erro ao carregar usuários",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const result = await removeUser(selectedUser.id);
    
    if (result.success) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao remover usuário",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  return (
    <div>
      <UserTableHeader onAddUser={() => setIsAddUserDialogOpen(true)} />
      
      <UsersTable 
        users={users} 
        isLoading={isLoading} 
        onEditUser={openEditDialog} 
        onDeleteUser={openDeleteDialog} 
      />

      {/* Diálogo para adicionar usuário */}
      <UserAddDialog 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
        onSuccess={loadUsers} 
      />

      {/* Diálogo para editar usuário */}
      {selectedUser && (
        <UserEditDialog 
          open={isEditUserDialogOpen} 
          onOpenChange={setIsEditUserDialogOpen} 
          onSuccess={loadUsers}
          user={selectedUser}
        />
      )}

      {/* Diálogo de confirmação para remover usuário */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
