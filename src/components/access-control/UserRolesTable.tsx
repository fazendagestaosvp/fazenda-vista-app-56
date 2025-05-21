
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserWithRole } from "./types";
import { Loader2 } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import UserRoleActions from "./UserRoleActions";

type UserRolesTableProps = {
  users: UserWithRole[];
  loading: boolean;
  onRoleChange: () => void;
};

const UserRolesTable = ({ users, loading, onRoleChange }: UserRolesTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-farm" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead className="w-[350px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <UserRoleActions 
                  user={user} 
                  onRoleChange={onRoleChange} 
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-6">
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserRolesTable;
