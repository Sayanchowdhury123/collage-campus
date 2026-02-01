import { z } from "zod";

export const editProfileZodschema = z.object({
  semester: z.number().int().min(1).max(8).optional(),
  batch: z.number().int().min(2020).max(2030).optional(),
  course: z.string().optional(),
  bio: z.string().trim().optional(),
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be atleast 2 letters")
    .max(50, "Name must be less than 50 letters")
    .optional(),
});


export const userIdParamSchema = z.object({
    id: z.string().min(1, "movie ID is required").length(24, "Invalid movie ID format").regex(/^[a-fA-F0-9]+$/, "ID must be a valid hex string"),
});
