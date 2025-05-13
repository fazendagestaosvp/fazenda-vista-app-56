
import { CalendarIcon, IdCard, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";

export const EarTagField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const IdentificationField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const NameField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const BreedField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const CoatColorField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const CategoryField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const GenderField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const BirthDateField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const BirthSeasonField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const WeightField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const StatusField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const ObservationsField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);
