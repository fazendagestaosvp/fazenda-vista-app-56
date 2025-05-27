
import { supabase } from "@/integrations/supabase/client";

export const updateUserPassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
