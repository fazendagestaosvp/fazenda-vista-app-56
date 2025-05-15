import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { HealthRecord } from "@/hooks/use-health-history";

// Esquema de validação
const formSchema = z.object({
  animalId: z.string().min(1, { message: "ID do animal é obrigatório" }),
  animalName: z.string().min(1, { message: "Nome do animal é obrigatório" }),
  animalType: z.string().min(1, { message: "Tipo do animal é obrigatório" }),
  type: z.string().min(1, { message: "Tipo de procedimento é obrigatório" }),
  procedure: z.string().min(1, { message: "Procedimento é obrigatório" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  veterinarian: z.string().min(1, { message: "Nome do veterinário é obrigatório" }),
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Status é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

interface HealthHistoryFormProps {
  onSuccess: (data: HealthRecord) => void;
  onCancel: () => void;
  initialData?: HealthRecord;
}

export function HealthHistoryForm({ onSuccess, onCancel, initialData }: HealthHistoryFormProps) {
  // Configuração do formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: new Date(initialData.date)
    } : {
      animalId: "",
      animalName: "",
      animalType: "Gado",
      type: "Vacinação",
      procedure: "",
      date: new Date(),
      veterinarian: "",
      notes: "",
      status: "Agendado",
    },
  });

  // Manipulador de envio
  const onSubmit = (values: FormValues) => {
    const newRecord: HealthRecord = {
      id: initialData?.id || `HR-${Math.floor(Math.random() * 1000)}`,
      ...values,
    };
    
    onSuccess(newRecord);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Animal ID */}
          <FormField
            control={form.control}
            name="animalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Animal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: BG-101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Animal Name */}
          <FormField
            control={form.control}
            name="animalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Animal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Estrela" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Animal Type */}
          <FormField
            control={form.control}
            name="animalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Animal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Gado">Gado</SelectItem>
                    <SelectItem value="Cavalo">Cavalo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Procedure Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Procedimento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Vacinação">Vacinação</SelectItem>
                    <SelectItem value="Exame">Exame</SelectItem>
                    <SelectItem value="Tratamento">Tratamento</SelectItem>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Procedure */}
          <FormField
            control={form.control}
            name="procedure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Procedimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Febre Aftosa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
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
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Veterinarian */}
          <FormField
            control={form.control}
            name="veterinarian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinário</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Dr. Carlos Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o procedimento..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-farm hover:bg-farm-dark">
            {initialData ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
