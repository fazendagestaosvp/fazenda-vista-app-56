
import { UiRole } from "@/types/user.types";

export type UserWithRole = {
  id: string;
  email: string;
  role: UiRole;
};
