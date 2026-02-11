import { z } from "zod";



const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const groupparam = z.object({
gid: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
userid:z.string().regex(objectIdRegex, "Invalid ID format").optional(),
postid:z.string().regex(objectIdRegex, "Invalid ID format").optional(),

})

export const groupzodschema = z.object({
  name: z
    .string()
    .min(2, "Post content is required")
    .max(50, "Post cannot exceed 1000 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Post content is required")
    .max(500, "Post cannot exceed 1000 characters")
    .trim(),
});


