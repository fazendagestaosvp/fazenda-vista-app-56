
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const EarTagIdField = ({ control }: { control: any }) => (
  <FormField
    control={control}
    name="earTagId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Brinco/Tag</FormLabel>
        <FormControl>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="BG-101" className="pl-10" {...field} />
          </div>
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
