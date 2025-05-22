
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a user's profile information
 */
export const updateUserProfile = async (
  userId: string,
  fullName?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!fullName) return { success: true };
    
    // Update profile if fullName is provided
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', userId);
      
    if (profileError) {
      throw new Error(profileError.message);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};
