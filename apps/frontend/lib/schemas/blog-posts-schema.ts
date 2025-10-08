import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),

  // SEO fields
  metaTitle: z
    .string()
    .max(200, "Meta title must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(500, "Meta description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  metaKeywords: z
    .string()
    .max(500, "Meta keywords must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  canonicalUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  // Media fields
  featuredImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  featuredImageAlt: z
    .string()
    .max(200, "Alt text must be less than 200 characters")
    .optional()
    .or(z.literal("")),

  // Status and visibility
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isPublished: z.boolean().default(false),

  // Category (optional)
  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional()
    .or(z.literal("none")),

  // Tags (array of tag IDs)
  tagIds: z.array(z.string().uuid("Invalid tag ID")).default([]),

  // Reading time and word count (optional, can be calculated)
  readingTime: z.number().int().positive().optional(),
  wordCount: z.number().int().positive().optional(),
});

export const editBlogPostSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),

  // SEO fields
  metaTitle: z
    .string()
    .max(200, "Meta title must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(500, "Meta description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  metaKeywords: z
    .string()
    .max(500, "Meta keywords must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  canonicalUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  // Media fields
  featuredImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  featuredImageAlt: z
    .string()
    .max(200, "Alt text must be less than 200 characters")
    .optional()
    .or(z.literal("")),

  // Status and visibility
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isPublished: z.boolean().default(false),

  // Category (optional)
  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional()
    .or(z.literal("none")),

  // Tags (array of tag IDs)
  tagIds: z.array(z.string().uuid("Invalid tag ID")).default([]),

  // Reading time and word count (optional, can be calculated)
  readingTime: z.number().int().positive().optional(),
  wordCount: z.number().int().positive().optional(),
});

export type BlogPostSchemaType = z.infer<typeof blogPostSchema>;
export type EditBlogPostSchemaType = z.infer<typeof editBlogPostSchema>;
