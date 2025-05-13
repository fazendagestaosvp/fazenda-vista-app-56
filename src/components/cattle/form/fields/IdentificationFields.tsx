
import { IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
        <FormLabel>Nome (opcional)</FormLabel>
        <FormControl>
          <Input placeholder="Nome do animal (opcional)" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
