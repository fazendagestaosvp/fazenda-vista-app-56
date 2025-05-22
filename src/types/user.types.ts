export type UiRole = "admin" | "editor" | "viewer";
export type DbRole = "admin" | "user" | "viewer";

export const mapDbRoleToUiRole = (dbRole: DbRole): UiRole => {
  if (dbRole === "user") return "editor";
  return dbRole as UiRole;
};

export const mapUiRoleToDbRole = (uiRole: UiRole): DbRole => {
  if (uiRole === "editor") return "user";
  return uiRole as DbRole;
};
