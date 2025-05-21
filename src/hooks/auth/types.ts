
import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: "admin" | "editor" | "viewer" | null;
  loading: boolean;
  signIn: (email: string, password: string, onSuccess?: () => void, onError?: (message: string) => void) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isViewer: () => boolean;
  isEditor: () => boolean;
}
