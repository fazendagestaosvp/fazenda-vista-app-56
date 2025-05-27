
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRoleManagement, UserWithRole, ContaData } from "@/hooks/useRoleManagement";

interface VisualizadorPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole;
  onSuccess: () => void;
}

export const VisualizadorPermissionsDialog = ({
  open,
  onOpenChange,
  user,
  onSuccess
}: VisualizadorPermissionsDialogProps) => {
  const [contas, setContas] = useState<ContaData[]>([]);
  const [selectedContas, setSelectedContas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { 
    fetchContas, 
    fetchVisualizadorPermissions, 
    manageVisualizadorPermissions 
  } = useRoleManagement();

  useEffect(() => {
    if (open && user) {
      loadData();
    }
  }, [open, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar contas disponíveis
      const contasData = await fetchContas();
      setContas(contasData);

      // Carregar permissões atuais do usuário
      const permissions = await fetchVisualizadorPermissions(user.id);
      setSelectedContas(permissions);
    } finally {
      setLoading(false);
    }
  };

  const handleContaToggle = (contaId: string, checked: boolean) => {
    if (checked) {
      setSelectedContas(prev => [...prev, contaId]);
    } else {
      setSelectedContas(prev => prev.filter(id => id !== contaId));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await manageVisualizadorPermissions(user.id, selectedContas);
      if (success) {
        onSuccess();
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
          <DialogDescription>
            Selecione quais contas o usuário <strong>{user.full_name || user.email}</strong> pode visualizar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-farm"></div>
            </div>
          ) : (
            contas.map((conta) => (
              <div key={conta.id} className="flex items-center space-x-2">
                <Checkbox
                  id={conta.id}
                  checked={selectedContas.includes(conta.id)}
                  onCheckedChange={(checked) => 
                    handleContaToggle(conta.id, checked as boolean)
                  }
                />
                <Label htmlFor={conta.id} className="text-sm font-medium">
                  {conta.nome_conta}
                </Label>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
