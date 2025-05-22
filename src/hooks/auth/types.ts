
import { Session, User } from "@supabase/supabase-js";
import { UiRole } from "@/types/user.types";

// Define the return type for authentication results
export interface AuthResult {
  success: boolean;
  error?: string | null;
}

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
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  isAdmin: () => boolean;
  isViewer: () => boolean;
  isEditor: () => boolean;
  canEdit: () => boolean;
  hasAccessLevel: (minimumLevel: "admin" | "editor" | "viewer") => boolean;
};
