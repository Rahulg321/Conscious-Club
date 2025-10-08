import { z } from "zod";

export const blogCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export const editBlogCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export type BlogCategorySchemaType = z.infer<typeof blogCategorySchema>;
export type EditBlogCategorySchemaType = z.infer<typeof editBlogCategorySchema>;
