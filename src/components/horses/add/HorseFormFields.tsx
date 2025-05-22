
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { horseSchema } from "./horseSchema";

export type HorseFormValues = z.infer<typeof horseSchema>;

interface HorseFormFieldsProps {
  onSubmit: (values: HorseFormValues) => void;
  standardVaccinations: string[];
  isOpen: boolean;
}

export function HorseFormFields({ 
  onSubmit, 
  standardVaccinations,
  isOpen 
}: HorseFormFieldsProps) {
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

  return (
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
  );
}
