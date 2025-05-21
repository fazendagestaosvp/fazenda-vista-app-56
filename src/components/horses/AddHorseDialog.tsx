
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Define the horse schema
const horseSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres",
  }),
  breed: z.string().min(1, {
    message: "A raça é obrigatória",
  }),
  color: z.string().min(1, {
    message: "A cor é obrigatória",
  }),
  gender: z.string().min(1, {
    message: "Selecione um gênero",
  }),
  status: z.string().min(1, {
    message: "Selecione um status",
  }),
  sire: z.string().optional(),
  dam: z.string().optional(),
  birthDate: z.date().optional(),
  vaccinations: z.array(z.object({
    name: z.string(),
    date: z.date().optional(),
    applied: z.boolean().default(false),
  })),
  customVaccinations: z.array(z.object({
    name: z.string(),
    date: z.date().optional(),
    applied: z.boolean().default(false),
  })).default([]),
});

type HorseFormValues = z.infer<typeof horseSchema>;

interface AddHorseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHorse: (horseData: any) => void;
  standardVaccinations: string[];
}

export function AddHorseDialog({ 
  isOpen, 
  onOpenChange,
  onAddHorse,
  standardVaccinations
}: AddHorseDialogProps) {
  const { toast } = useToast();

  const form = useForm<HorseFormValues>({
    resolver: zodResolver(horseSchema),
    defaultValues: {
      name: "",
      breed: "",
      color: "",
      gender: "",
      status: "Ativo - Potro",
      vaccinations: standardVaccinations.map(name => ({ name, date: null, applied: false })),
      customVaccinations: [],
    },
  });

  // Reset form when dialog is opened
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        breed: "",
        color: "",
        gender: "",
        status: "Ativo - Potro",
        vaccinations: standardVaccinations.map(name => ({ name, date: null, applied: false })),
        customVaccinations: [],
      });
    }
  }, [isOpen, form, standardVaccinations]);

  const onSubmit = (values: HorseFormValues) => {
    // Create a new horse with all required fields
    const newHorse = {
      id: `HC-${Math.floor(Math.random() * 900) + 100}`,
      name: values.name,
      age: values.birthDate ? new Date().getFullYear() - values.birthDate.getFullYear() : 0,
      breed: values.breed,
      color: values.color,
      gender: values.gender,
      status: values.status,
      sire: values.sire || "Não informado",
      dam: values.dam || "Não informado",
      birthDate: values.birthDate || new Date(),
      sireImage: "",
      damImage: "",
      vaccinations: standardVaccinations.map(name => ({ 
        name, 
        date: null, 
        applied: false 
      })),
      customVaccinations: [],
    };

    // Add the new horse
    onAddHorse(newHorse);
    
    // Close the dialog
    onOpenChange(false);
    
    // Show success toast
    toast({
      title: "Cavalo adicionado",
      description: `${newHorse.name} foi adicionado com sucesso.`
    });
    
    // Reset the form
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cavalo</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo cavalo
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cavalo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raça</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a raça do cavalo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a cor do cavalo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gênero</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Macho" id="gender-male" />
                        <Label htmlFor="gender-male">Macho</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Fêmea" id="gender-female" />
                        <Label htmlFor="gender-female">Fêmea</Label>
                      </div>
                    </RadioGroup>
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
                      <SelectItem value="Ativo - Potro">Potro</SelectItem>
                      <SelectItem value="Ativo - Em doma">Em doma</SelectItem>
                      <SelectItem value="Ativo - Domado">Domado</SelectItem>
                      <SelectItem value="Em descanso">Em descanso</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                      <SelectItem value="Inseminado">Inseminado</SelectItem>
                      <SelectItem value="Morto">Morto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Salvar Cavalo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
