
export type UserRoleType = "ADM" | "EDITOR" | "VISUALIZADOR";

export interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRoleType;
}

export interface ContaData {
  id: string;
  nome_conta: string;
  proprietario_id: string | null;
}
