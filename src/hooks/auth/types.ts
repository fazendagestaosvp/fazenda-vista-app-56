
import { Session, User } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

export type AuthContextType = {
  session: Session | null;
  user: any;
  userRole: UiRole | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  isAdmin: () => boolean;
  isViewer: () => boolean;
  isEditor: () => boolean;
  canEdit: () => boolean;
  hasAccessLevel: (minimumLevel: "admin" | "editor" | "viewer") => boolean;
};
