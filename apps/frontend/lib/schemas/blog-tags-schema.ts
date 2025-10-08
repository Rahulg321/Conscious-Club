import { z } from "zod";

export const blogTagSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export const editBlogTagSchema = z.object({
  id: z.string().uuid("Invalid tag ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export type BlogTagSchemaType = z.infer<typeof blogTagSchema>;
export type EditBlogTagSchemaType = z.infer<typeof editBlogTagSchema>;
