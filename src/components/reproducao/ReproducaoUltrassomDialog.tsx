
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReproducaoAnimal } from "@/hooks/use-reproducao";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Schema para validação do formulário de ultrassom
const ultrassomSchema = z.object({
  data: z.date({
    required_error: "A data do ultrassom é obrigatória",
  }),
  resultado: z.enum(["POSITIVO", "NEGATIVO"], {
    required_error: "O resultado do ultrassom é obrigatório",
  }),
  observacoes: z.string().optional(),
});

type UltrassomFormValues = z.infer<typeof ultrassomSchema>;

interface ReproducaoUltrassomDialogProps {
  reproducao: ReproducaoAnimal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reproducao: ReproducaoAnimal) => void;
}

export function ReproducaoUltrassomDialog({
  reproducao,
  open,
  onOpenChange,
  onSuccess,
}: ReproducaoUltrassomDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reproducao) return null;

  // Determinar o número deste ultrassom
  const numeroUltrassom = reproducao.ultrassons.length + 1;

  const form = useForm<UltrassomFormValues>({
    resolver: zodResolver(ultrassomSchema),
    defaultValues: {
      data: new Date(),
      observacoes: "",
    },
  });

  const onSubmit = (data: UltrassomFormValues) => {
    setIsSubmitting(true);

    // Simular chamada à API
    setTimeout(() => {
      const novoUltrassom = {
        id: `U${Date.now()}`,
        data: data.data,
        numero: numeroUltrassom,
        resultado: data.resultado,
        observacoes: data.observacoes || "",
      };

      // Atualizar o registro de reprodução com o novo ultrassom
      const novaListaUltrassons = [...reproducao.ultrassons, novoUltrassom];
      
      // Atualizar o status da prenhez com base no resultado do ultrassom
      let novoStatus = reproducao.statusPrenhez;
      
      // Lógica para determinar o status
      if (data.resultado === "POSITIVO") {
        novoStatus = "PRENHA";
      } else if (data.resultado === "NEGATIVO") {
        // Se for o segundo ultrassom negativo ou mais, retorna para repasse
        if (numeroUltrassom >= 2) {
          novoStatus = "FALHADA";
        } else {
          novoStatus = "PENDENTE";
        }
      }

      const reproducaoAtualizada = {
        ...reproducao,
        ultrassons: novaListaUltrassons,
        statusPrenhez: novoStatus,
      };

      onSuccess(reproducaoAtualizada);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-farm">
            Registro de Ultrassom
          </DialogTitle>
          <DialogDescription>
            {reproducao.animalIdentificacao} - {reproducao.animalNome} ({numeroUltrassom}º Ultrassom)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Exame</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resultado"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Resultado</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="POSITIVO" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Positivo (Prenha)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="NEGATIVO" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Negativo (Não prenha)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre o exame..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-farm hover:bg-farm-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Ultrassom"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
