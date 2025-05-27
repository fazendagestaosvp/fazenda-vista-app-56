
// Re-export all user service functionality
export * from './types';
export * from './authService';
export * from './accountService';
export * from './sessionService';
export * from './profileService';

// Resolve name conflict by explicitly re-exporting with different names
export { deleteUser as adminDeleteUser } from './adminService';
export { 
  getAllUsersWithProfiles, 
  createUser, 
  getUserById, 
  updateUserAdmin, 
  getCompleteUser,
  updateUserRole
} from './adminService';

export * from './management';
