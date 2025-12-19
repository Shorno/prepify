import { z } from "zod";

export const commentSchema = z.object({
    content: z.string()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment must be less than 500 characters")
        .trim(),
    noteId: z.number().int().positive(),
});

export type CommentFormData = z.infer<typeof commentSchema>;
