import { z } from "zod";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const postidschema = z.object({
  postid: z.string().regex(objectIdRegex, "Invalid ID format"),
  userid: z.string().regex(objectIdRegex, "Invalid userid format").optional(),
});

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(1000, "Post cannot exceed 1000 characters")
    .trim(),
 
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(1000, "Post cannot exceed 1000 characters")
    .trim()
    .optional(),
});

export const getQueryschema = z.object({
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
