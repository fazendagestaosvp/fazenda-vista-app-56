
import { z } from "zod";

export const cattleFormSchema = z.object({
  earTagId: z.string().min(1, {
    message: "Brinco/Tag é obrigatório",
  }),
  name: z.string().optional(), // Changed from required to optional
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
  farmEntryDate: z.date({
    required_error: "Data de entrada na fazenda é obrigatória",
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

export type CattleFormValues = z.infer<typeof cattleFormSchema>;
