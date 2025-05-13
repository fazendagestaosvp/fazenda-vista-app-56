
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, IdCard, Circle, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const cattleFormSchema = z.object({
  earTagNumber: z.string().min(1, {
    message: "Número do brinco é obrigatório",
  }),
  identification: z.string().min(1, {
    message: "Identificação é obrigatória",
  }),
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  breed: z.string().min(1, {
    message: "Raça é obrigatória",
  }),
  coatColor: z.string().min(1, {
    message: "Pelagem é obrigatória",
  }),
  category: z.string().min(1, {
    message: "Categoria é obrigatória",
  }),
  birthDate: z.date({
    required_error: "Data de nascimento é obrigatória",
  }),
  birthSeason: z.string().min(1, {
    message: "Época de nascimento é obrigatória",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Peso deve ser um número",
  }),
  gender: z.string().min(1, {
    message: "Gênero é obrigatório",
  }),
  status: z.string().min(1, {
    message: "Status é obrigatório",
  }),
  observations: z.string().optional(),
});

type CattleFormValues = z.infer<typeof cattleFormSchema>;

interface AddCattleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function AddCattleForm({ onSuccess, onCancel, initialData, isEditing = false }: AddCattleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CattleFormValues>({
    resolver: zodResolver(cattleFormSchema),
    defaultValues: {
      earTagNumber: "",
      identification: "",
      name: "",
      breed: "",
      coatColor: "",
      category: "",
      birthSeason: "",
      weight: "",
      gender: "",
      status: "Saudável",
      observations: "",
    },
  });

  // Populate the form with initial data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        earTagNumber: initialData.id || "",
        identification: initialData.id || "",
        name: initialData.name || "",
        breed: initialData.type || "",
        coatColor: initialData.coatColor || "",
        category: initialData.category || "Boi",
        birthDate: initialData.lastCheck || new Date(),
        birthSeason: initialData.birthSeason || "",
        weight: initialData.weight?.toString() || "",
        gender: initialData.gender || "",
        status: initialData.status || "Saudável",
        observations: initialData.observations || "",
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = (data: CattleFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitted cattle data:", data);
      
      // Update the current cattle data if editing
      if (isEditing && initialData) {
        initialData.id = data.earTagNumber;
        initialData.name = data.name;
        initialData.type = data.breed;
        initialData.coatColor = data.coatColor;
        initialData.age = calculateAge(data.birthDate);
        initialData.weight = parseFloat(data.weight);
        initialData.status = data.status;
        initialData.gender = data.gender;
        initialData.lastCheck = data.birthDate;
        initialData.birthSeason = data.birthSeason;
        initialData.observations = data.observations;
      }

      toast({
        title: isEditing ? "Animal atualizado com sucesso" : "Animal adicionado com sucesso",
        description: `ID: ${data.identification}`,
      });
      
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="earTagNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Brinco</FormLabel>
              <FormControl>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="12345" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificação/Tag</FormLabel>
              <FormControl>
                <Input placeholder="BG-101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do animal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raça</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raça" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nelore">Nelore</SelectItem>
                  <SelectItem value="Angus">Angus</SelectItem>
                  <SelectItem value="Brahman">Brahman</SelectItem>
                  <SelectItem value="Gir">Gir</SelectItem>
                  <SelectItem value="Holandesa">Holandesa</SelectItem>
                  <SelectItem value="Jersey">Jersey</SelectItem>
                  <SelectItem value="Simental">Simental</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coatColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pelagem</FormLabel>
              <FormControl>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Cor da pelagem" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Bezerro">Bezerro</SelectItem>
                  <SelectItem value="Novilha">Novilha</SelectItem>
                  <SelectItem value="Vaca">Vaca</SelectItem>
                  <SelectItem value="Touro">Touro</SelectItem>
                  <SelectItem value="Boi">Boi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Fêmea">Fêmea</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
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
          name="birthSeason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Época de Nascimento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a época" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Primavera">Primavera</SelectItem>
                  <SelectItem value="Outono">Outono</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="450" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="Saudável">Saudável</SelectItem>
                  <SelectItem value="Doente">Doente</SelectItem>
                  <SelectItem value="Em tratamento">Em tratamento</SelectItem>
                  <SelectItem value="Em observação">Em observação</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                  <SelectItem value="Óbito">Óbito</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adicione observações sobre o animal..."
                  className="min-h-[100px]"
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
      </form>
    </Form>
  );
}
