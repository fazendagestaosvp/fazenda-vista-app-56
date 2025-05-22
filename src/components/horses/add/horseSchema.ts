
import { z } from "zod";

// Define the horse schema
export const horseSchema = z.object({
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
