
import { Profile, DbRole, UiRole } from "@/types/user.types";
import { VerifyOtpParams } from "@supabase/supabase-js";

export interface CreateUserProps {
  email: string;
  password?: string;
}

export interface UpdateUserAdminProps {
  userId: string;
  email?: string;
  password?: string;
  role?: DbRole;
  user_metadata?: { [key: string]: any };
}

export interface UpdateUserProps {
  userId: string;
  fullName?: string;
  role?: UiRole;
}

export interface InitProfileProps {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
}

export interface SignInProps {
  email: string;
  password: string;
}

export interface ResetPasswordProps {
  email: string;
}

export interface VerifyEmailProps {
  email: string;
  token: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserWithProfile {
  id: string;
  name: string;
  email: string;
  role: UiRole;
  created_at: string;
}
