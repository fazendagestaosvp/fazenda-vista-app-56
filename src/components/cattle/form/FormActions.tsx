
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing: boolean;
}

export function FormActions({ isSubmitting, onCancel, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-farm hover:bg-farm-dark" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Atualizando..." : "Salvando..."}
          </>
        ) : (
          isEditing ? "Atualizar Animal" : "Salvar Animal"
        )}
      </Button>
    </div>
  );
}
