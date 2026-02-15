import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const ResourceParam = z.object({
  resourceid: z.string().regex(objectIdRegex, "Invalid ID format"),
});

export const createResourceSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1).max(50),
  semester: z.number().int().min(1).max(8),
  course: z.string().min(1).max(50),
 
});


export const updateResourceSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  subject: z.string().min(1).max(50).optional(),
  semester: z.number().int().min(1).max(8).optional(),
  course: z.string().min(1).max(50).optional(),
  groupId: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
});

export const getResourceQuery = z.object({
  subject: z.string().min(1).max(50).optional(),
  semester: z.coerce.number().int().min(1).max(8).optional(),
  course: z.string().min(1).max(50).optional(),
  page: z.coerce
    .number("must be integer")
    .positive("should be positive")
    .min(1, "should not be less than 1")
    .default(1),
  limit: z.coerce
    .number("must be integer")
    .positive("should be positive")
    .min(1, "should not be less than 1")
    .max(50)
    .default(5),
});
