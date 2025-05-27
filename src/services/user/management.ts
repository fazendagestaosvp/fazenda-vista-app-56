
import { supabase } from "@/integrations/supabase/client";
import { UiRole } from "@/types/user.types";

interface UpdateUserParams {
  userId: string;
  role: UiRole;
}

export const updateUser = async ({ userId, role }: UpdateUserParams) => {
  try {
    const dbRole = role === 'admin' ? 'admin' : role === 'viewer' ? 'viewer' : 'editor';
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: dbRole })
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        profiles:user_id (
          full_name
        )
      `);

    if (error) throw error;

    // Get user emails
    const userIds = data?.map(item => item.user_id) || [];
    const { data: emailData } = await supabase.rpc('get_user_emails', { user_ids: userIds });

    const users = (data || []).map(item => {
      const emailInfo = emailData?.find(e => e.id === item.user_id);
      return {
        id: item.user_id,
        email: emailInfo?.email || 'Email não encontrado',
        full_name: item.profiles?.full_name,
        role: item.role as UiRole
      };
    });

    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
};
