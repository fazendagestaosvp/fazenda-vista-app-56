
import { Droplet } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
