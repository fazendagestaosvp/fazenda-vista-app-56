
export type UiRole = "admin" | "editor" | "viewer";
export type DbRole = "admin" | "user" | "viewer";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const mapDbRoleToUiRole = (dbRole: DbRole): UiRole => {
  if (dbRole === "user") return "editor";
  return dbRole as UiRole;
};

export const mapUiRoleToDbRole = (uiRole: UiRole): DbRole => {
  if (uiRole === "editor") return "user";
  return uiRole as DbRole;
};

// Alias for mapDbRoleToUiRole for backward compatibility
export const dbToUiRole = mapDbRoleToUiRole;
