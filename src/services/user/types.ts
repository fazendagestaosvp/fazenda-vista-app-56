
// Import necessary types
import { User } from "@supabase/supabase-js";

// General service response type
export interface ServiceResponse {
  success: boolean;
  error?: string;
}

// Authentication related types
export interface SignInProps {
  email: string;
  password: string;
}

export interface ResetPasswordProps {
  email: string;
}

export interface SignUpResponse {
  user: User | null;
  session?: any;
}

// User profile types
export interface UserProfile {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface CreateProfileProps {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UpdateProfileProps {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}
