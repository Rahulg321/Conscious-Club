import { z } from "zod";

export const bravoCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be less than 64 characters"),
  description: z.string().min(1, "Description is required"),
});

export type BravoCategorySchemaType = z.infer<typeof bravoCategorySchema>;
