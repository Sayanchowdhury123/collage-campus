import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const RegisterZodschema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be atleast 2 letters")
    .max(50, "Name must be less than 50 letters"),
  email: z.email("Invalid format").toLowerCase(),
  password: z
    .string("Password is required")
    .trim()
    .min(8, "Minimum 8 chartects required")
    .regex(
      passwordRegex,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    ),
  collegeId: z
    .string()
    .trim()
    .min(5, "College ID must be at least 5 characters"),
  semester: z.number().int().min(1).max(8),
  batch: z.number().int().min(2020).max(2030),
  course: z.string().optional(),
});

export const LoginZodschema = z.object({
  email: z.email("Invalid format").toLowerCase(),
  password: z.string("Password is required").trim(),
});
