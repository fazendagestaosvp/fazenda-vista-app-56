
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UiRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (data) {
        const dbRole = data.role;
        switch (dbRole) {
          case 'admin':
            setUserRole('admin');
            break;
          case 'viewer':
            setUserRole('viewer');
            break;
          default:
            setUserRole('editor');
            break;
        }
      } else {
        setUserRole('editor');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('editor');
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    }
  };

  // Role check functions
  const isAdmin = () => userRole === 'admin';
  const isEditor = () => userRole === 'editor';
  const isViewer = () => userRole === 'viewer';
  const canEdit = () => userRole === 'admin' || userRole === 'editor';

  return {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAdmin,
    isEditor,
    isViewer,
    canEdit,
  };
};
