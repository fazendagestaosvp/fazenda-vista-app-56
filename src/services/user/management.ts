
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

export const removeUser = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
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
        role
      `);

    if (error) throw error;

    // Get user emails
    const userIds = data?.map(item => item.user_id) || [];
    const { data: emailData } = await supabase.rpc('get_user_emails', { user_ids: userIds });

    // Get profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    const users = (data || []).map(item => {
      const emailInfo = emailData?.find(e => e.id === item.user_id);
      const profileInfo = profilesData?.find(p => p.id === item.user_id);
      return {
        id: item.user_id,
        email: emailInfo?.email || 'Email não encontrado',
        name: profileInfo?.full_name || 'Nome não encontrado',
        role: item.role as UiRole,
        created_at: new Date().toISOString()
      };
    });

    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
};
