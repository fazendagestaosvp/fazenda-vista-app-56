
export interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Database roles (as stored in Supabase)
export type DbRole = "admin" | "user" | "viewer";

// UI roles (as displayed in application)
export type UiRole = "admin" | "editor" | "viewer";

// Helper function to convert between role formats
export const dbToUiRole = (dbRole: DbRole): UiRole => {
  if (dbRole === "user") return "editor";
  return dbRole as UiRole;
};

// Helper function to convert UI role to DB role
export const uiToDbRole = (uiRole: UiRole): DbRole => {
  if (uiRole === "editor") return "user";
  return uiRole as DbRole;
};
