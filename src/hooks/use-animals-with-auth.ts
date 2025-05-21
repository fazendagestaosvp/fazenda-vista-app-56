import { useAuth } from "./useAuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useAnimalsWithAuth = () => {
  const { user, canEdit } = useAuth();
  const { toast } = useToast();

  return {
    user,
    canEdit,
    toast,
  };
};
