
import { useUsers } from './useUsers';
import { useUserRoleUpdate } from './useUserRoleUpdate';
import { useContas } from './useContas';
import { useVisualizadorPermissions } from './useVisualizadorPermissions';

export const useRoleManagement = () => {
  const { loading: usersLoading, fetchUsersWithRoles } = useUsers();
  const { loading: roleUpdateLoading, updateUserRole } = useUserRoleUpdate();
  const { fetchContas } = useContas();
  const { 
    loading: permissionsLoading, 
    manageVisualizadorPermissions, 
    fetchVisualizadorPermissions 
  } = useVisualizadorPermissions();

  const loading = usersLoading || roleUpdateLoading || permissionsLoading;

  return {
    loading,
    fetchUsersWithRoles,
    updateUserRole,
    fetchContas,
    manageVisualizadorPermissions,
    fetchVisualizadorPermissions
  };
};
