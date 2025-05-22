
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRoleSelect from "./UserRoleSelect";
import UserActionsMenu from "./UserActionsMenu";
import { UiRole } from "@/types/user.types";

interface User {
  id: string;
  name: string;
  email: string;
  role: UiRole;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export default function UsersTable({ 
  users, 
  isLoading, 
  onEditUser, 
  onDeleteUser 
}: UsersTableProps) {
  if (isLoading) {
    return <div className="flex justify-center py-4">Carregando usuários...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <UserRoleSelect 
                  userId={user.id} 
                  currentRole={user.role} 
                />
              </TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell>
                <UserActionsMenu 
                  user={user} 
                  onEdit={onEditUser} 
                  onDelete={onDeleteUser} 
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
