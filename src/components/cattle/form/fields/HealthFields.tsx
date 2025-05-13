
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
