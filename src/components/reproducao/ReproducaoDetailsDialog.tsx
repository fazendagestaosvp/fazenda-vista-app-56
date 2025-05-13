
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ReproducaoAnimal, UltrassomRegistro } from "@/hooks/use-reproducao";
import { Separator } from "@/components/ui/separator";
import { Stethoscope } from "lucide-react";

interface ReproducaoDetailsDialogProps {
  reproducao: ReproducaoAnimal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReproducaoDetailsDialog({
  reproducao,
  open,
  onOpenChange,
}: ReproducaoDetailsDialogProps) {
  if (!reproducao) return null;

  // Funções auxiliares para formato e cores
  const getMetodoLabel = (metodo: string) => {
    switch (metodo) {
      case "TOURE": return "Monta Natural";
      case "IATF": return "IATF";
      case "REPASSE": return "Repasse";
      default: return metodo;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRENHA": return "bg-green-100 text-green-800";
      case "FALHADA": return "bg-red-100 text-red-800";
      case "PENDENTE": return "bg-yellow-100 text-yellow-800";
      case "FINALIZADA": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PRENHA": return "Prenha";
      case "FALHADA": return "Falhada";
      case "PENDENTE": return "Pendente";
      case "FINALIZADA": return "Finalizada";
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">
            Detalhes da Reprodução
          </DialogTitle>
          <DialogDescription>
            Protocolo: {reproducao.numeroProtocolo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Animal</h3>
              <p>{reproducao.animalIdentificacao} - {reproducao.animalNome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
              <p>{reproducao.tipoAnimal === "bovino" ? "Bovino" : "Equino"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Método</h3>
              <p>{getMetodoLabel(reproducao.metodo)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge className={getStatusColor(reproducao.statusPrenhez)}>
                {getStatusLabel(reproducao.statusPrenhez)}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Início</h3>
              <p>{format(reproducao.dataInicio, "dd/MM/yyyy")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data Final</h3>
              <p>{reproducao.dataFim ? format(reproducao.dataFim, "dd/MM/yyyy") : "Em andamento"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Destino</h3>
              <p>{reproducao.destino || "Não definido"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Observações</h3>
            <p>{reproducao.observacoes || "Nenhuma observação registrada"}</p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-4 w-4" />
              <h3 className="font-medium">Histórico de Ultrassons</h3>
            </div>

            {reproducao.ultrassons.length === 0 ? (
              <p className="text-gray-500">Nenhum ultrassom registrado</p>
            ) : (
              <div className="space-y-4">
                {reproducao.ultrassons.map((ultrassom: UltrassomRegistro) => (
                  <div key={ultrassom.id} className="border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Data</h4>
                        <p>{format(ultrassom.data, "dd/MM/yyyy")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Exame</h4>
                        <p>{ultrassom.numero}º Ultrassom</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Resultado</h4>
                        <Badge className={
                          ultrassom.resultado === "POSITIVO" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                        }>
                          {ultrassom.resultado === "POSITIVO" ? "Positivo" : "Negativo"}
                        </Badge>
                      </div>
                    </div>
                    {ultrassom.observacoes && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-500">Observações</h4>
                        <p className="text-sm">{ultrassom.observacoes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
