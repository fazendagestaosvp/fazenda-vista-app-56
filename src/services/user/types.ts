
// Import necessary types
import { User } from "@supabase/supabase-js";

// General service response type
export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
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

// User management types
export interface UpdateUserProps {
  userId: string;
  fullName?: string;
  role?: string;
  email?: string;
  isActive?: boolean;
}

export interface UpdateUserAdminProps {
  userId: string;
  email?: string;
  password?: string;
  role?: string;
  user_metadata?: { [key: string]: any };
}

// Interface for user with profile information
export interface UserWithProfile extends User {
  profile?: UserProfile;
  role?: string;
}

export interface InitProfileProps {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
}
