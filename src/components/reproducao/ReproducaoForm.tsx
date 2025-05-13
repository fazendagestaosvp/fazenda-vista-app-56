
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { MetodoReproducao, ReproducaoAnimal, StatusPrenhez, TipoAnimal } from "@/hooks/use-reproducao";

// Schema para validação do formulário
const reproducaoSchema = z.object({
  animalId: z.string().min(1, {
    message: "ID do animal é obrigatório",
  }),
  animalIdentificacao: z.string().min(1, {
    message: "Identificação do animal é obrigatória",
  }),
  animalNome: z.string().optional(),
  tipoAnimal: z.enum(["bovino", "equino"], {
    required_error: "O tipo do animal é obrigatório",
  }),
  metodo: z.enum(["TOURE", "IATF", "REPASSE"], {
    required_error: "O método de reprodução é obrigatório",
  }),
  dataInicio: z.date({
    required_error: "A data de início é obrigatória",
  }),
  dataFim: z.date().optional().nullable(),
  statusPrenhez: z.enum(["PENDENTE", "PRENHA", "FALHADA", "FINALIZADA"], {
    required_error: "O status da prenhez é obrigatório",
  }),
  destino: z.string().optional(),
  numeroProtocolo: z.string().min(1, {
    message: "O número do protocolo é obrigatório",
  }),
  observacoes: z.string().optional(),
});

type ReproducaoFormValues = z.infer<typeof reproducaoSchema>;

interface ReproducaoFormProps {
  onSuccess: (reproducao: ReproducaoAnimal) => void;
  onCancel: () => void;
  initialData?: ReproducaoAnimal;
  isEditing?: boolean;
  animalTipo?: TipoAnimal;
}

export function ReproducaoForm({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
  animalTipo,
}: ReproducaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock de dados de animais disponíveis
  const animalOptions = [
    { id: "BG-101", identificacao: "BG-101", nome: "Estrela", tipo: "bovino" },
    { id: "BG-102", identificacao: "BG-102", nome: "Trovão", tipo: "bovino" },
    { id: "BG-103", identificacao: "BG-103", nome: "Luna", tipo: "bovino" },
    { id: "EQ-101", identificacao: "EQ-101", nome: "Vendaval", tipo: "equino" },
    { id: "EQ-102", identificacao: "EQ-102", nome: "Tempestade", tipo: "equino" },
  ];

  // Filtrar animais por tipo se especificado
  const animaisFiltrados = animalTipo 
    ? animalOptions.filter(animal => animal.tipo === animalTipo)
    : animalOptions;

  const form = useForm<ReproducaoFormValues>({
    resolver: zodResolver(reproducaoSchema),
    defaultValues: {
      animalId: "",
      animalIdentificacao: "",
      animalNome: "",
      tipoAnimal: animalTipo || "bovino",
      metodo: "IATF",
      dataInicio: new Date(),
      dataFim: null,
      statusPrenhez: "PENDENTE",
      destino: "",
      numeroProtocolo: isEditing ? "" : `R${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      observacoes: "",
    },
  });

  // Preencher o formulário com dados iniciais se estiver editando
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        animalId: initialData.animalId,
        animalIdentificacao: initialData.animalIdentificacao,
        animalNome: initialData.animalNome,
        tipoAnimal: initialData.tipoAnimal,
        metodo: initialData.metodo,
        dataInicio: initialData.dataInicio,
        dataFim: initialData.dataFim,
        statusPrenhez: initialData.statusPrenhez,
        destino: initialData.destino,
        numeroProtocolo: initialData.numeroProtocolo,
        observacoes: initialData.observacoes,
      });
    }
  }, [initialData, isEditing, form]);

  // Evento de seleção de animal
  const handleAnimalSelect = (animalId: string) => {
    const selectedAnimal = animalOptions.find(animal => animal.id === animalId);
    if (selectedAnimal) {
      form.setValue("animalIdentificacao", selectedAnimal.identificacao);
      form.setValue("animalNome", selectedAnimal.nome);
      form.setValue("tipoAnimal", selectedAnimal.tipo as TipoAnimal);
    }
  };

  const onSubmit = (data: ReproducaoFormValues) => {
    setIsSubmitting(true);

    // Simular chamada a API
    setTimeout(() => {
      // Criar ou atualizar o registro de reprodução
      const reproducaoData: ReproducaoAnimal = {
        id: initialData?.id || `R${Date.now()}`,
        animalId: data.animalId,
        animalIdentificacao: data.animalIdentificacao,
        animalNome: data.animalNome || "",
        tipoAnimal: data.tipoAnimal,
        metodo: data.metodo,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim,
        statusPrenhez: data.statusPrenhez,
        destino: data.destino || "",
        numeroProtocolo: data.numeroProtocolo,
        ultrassons: initialData?.ultrassons || [],
        observacoes: data.observacoes || "",
      };

      onSuccess(reproducaoData);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Dados do animal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="animalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleAnimalSelect(value);
                  }}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o animal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {animaisFiltrados.map(animal => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.identificacao} - {animal.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoAnimal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Animal</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isEditing || !!animalTipo}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bovino">Bovino</SelectItem>
                    <SelectItem value="equino">Equino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroProtocolo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº Protocolo</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dados da reprodução */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="metodo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TOURE">Monta Natural (TOURE)</SelectItem>
                    <SelectItem value="IATF">IATF</SelectItem>
                    <SelectItem value="REPASSE">Repasse</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="statusPrenhez"
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
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="PRENHA">Prenha</SelectItem>
                    <SelectItem value="FALHADA">Falhada</SelectItem>
                    <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
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
            name="dataFim"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Final (opcional)</FormLabel>
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
                      selected={field.value || undefined}
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
            name="destino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino</FormLabel>
                <FormControl>
                  <Input placeholder="Destino do animal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione observações sobre o processo reprodutivo..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
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
                {isEditing ? "Atualizando..." : "Salvando..."}
              </>
            ) : (
              isEditing ? "Atualizar" : "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
