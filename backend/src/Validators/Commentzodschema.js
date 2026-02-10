import {z} from "zod"


const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const commentparam = z.object({
postid: z.string().regex(objectIdRegex, "Invalid ID format").optional(),
commentid:z.string().regex(objectIdRegex, "Invalid ID format").optional(),

})

export const addComment = z.object({
    message:z.string().trim().min(3,"min 3 letters").max(200,"max 100 letters")
})

export const getPagschema = z.object({
  s: z.coerce
    .number("must be integer")
    .default(0),
  l: z.coerce
    .number("must be integer")
    .positive("should be positive")
    .min(1, "should not be less than 1")
    .default(2),
});