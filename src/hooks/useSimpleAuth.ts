
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
    console.log("useSimpleAuth: Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        console.log("User found, fetching role for:", session.user.id);
        await fetchUserRole(session.user.id);
      } else {
        console.log("No user, clearing role");
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    const getInitialSession = async () => {
      console.log("Checking for existing session");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      
      console.log("Initial session:", session?.user?.email || "No session");
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching role for user:", userId);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('editor');
        return;
      }

      if (data) {
        const dbRole = data.role;
        console.log("User role from DB:", dbRole);
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
        console.log("No role found, defaulting to editor");
        setUserRole('editor');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('editor');
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in for:", email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }
    console.log("Sign in successful");
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("Attempting sign up for:", email);
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
      console.error("Sign up error:", error);
      throw error;
    }
    console.log("Sign up successful");
  };

  const signOut = async () => {
    console.log("Attempting sign out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    console.log("Sign out successful");
  };

  const resetPassword = async (email: string) => {
    console.log("Attempting password reset for:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    console.log("Password reset email sent");
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
