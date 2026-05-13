import { z } from "zod";
import { VehicleCategory } from "@prisma/client";

export const ProfileSchema = z.object({
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  phone: z.string().min(10, "Telefone inválido").optional(),
  pricePerLesson: z
    .number({ error: "Preço inválido" })
    .min(50, "Preço mínimo: R$ 50")
    .max(500, "Preço máximo: R$ 500"),
  serviceRadius: z.number().min(2).max(50).default(10),
  city: z.string().min(2).optional(),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)").optional(),
  areas: z.array(z.string()).default([]),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const PLATE_REGEX = /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/i;

export const VehicleSchema = z.object({
  plate: z
    .string()
    .regex(PLATE_REGEX, "Placa inválida. Use o formato AAA-0000 ou AAA-0A00"),
  brand: z.string().min(1, "Marca obrigatória"),
  model: z.string().min(1, "Modelo obrigatório"),
  year: z
    .number()
    .int()
    .min(2000, "Ano inválido")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  color: z.string().min(1, "Cor obrigatória"),
  category: z.nativeEnum(VehicleCategory).default(VehicleCategory.AUTO),
  isPrimary: z.boolean().default(false),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
export type VehicleInput = z.infer<typeof VehicleSchema>;
