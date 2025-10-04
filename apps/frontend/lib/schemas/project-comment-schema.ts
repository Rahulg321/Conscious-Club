import { z } from "zod";

export const projectCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment must be less than 1000 characters"),
  projectId: z
    .string()
    .min(1, "Project ID is required")
    .uuid("Invalid project ID"),
});

export type ProjectCommentSchemaType = z.infer<typeof projectCommentSchema>;
