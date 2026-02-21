import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const groupparam = z.object({
  gid: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
  userid: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
  postid: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
});

export const groupzodschema = z.object({
  name: z
    .string()
    .min(2, "name is required")
    .max(50, "name cannot exceed 1000 characters")
    .trim(),

  description: z
    .string()
    .min(10, "description is required")
    .max(500, "description cannot exceed 1000 characters")
    .trim(),
});

export const groupupdateschema = z.object({
  name: z
    .string()
    .min(2, "name is required")
    .max(50, "name cannot exceed 1000 characters")
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, "description is required")
    .max(500, "description cannot exceed 1000 characters")
    .trim()
    .optional(),
});

export const getGroupQuery = z.object({
  searchValue: z.string().min(1).max(100).toLowerCase().optional(),
  sort: z.string().min(1).max(4).trim().toLowerCase().optional(),
});
