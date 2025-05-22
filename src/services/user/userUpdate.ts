
import { UiRole } from "@/types/user.types";
import { updateUserProfile } from "./profileManagement";
import { updateUserRole } from "./roleManagement";

/**
 * Updates a user's information including role and profile
 */
export const updateUser = async ({
  userId,
  role,
  fullName
}: {
  userId: string;
  role?: UiRole;
  fullName?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Updating user:", { userId, role, fullName });
    
    // Update profile if fullName is provided
    if (fullName) {
      const { success, error } = await updateUserProfile(userId, fullName);
      if (!success) {
        throw new Error(error);
      }
    }
    
    // Update role if provided
    if (role) {
      const { success, error } = await updateUserRole(userId, role);
      if (!success) {
        throw new Error(error);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};
