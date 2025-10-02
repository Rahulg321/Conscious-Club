import { z } from "zod";

export const bravoUploadSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be less than 64 characters"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File, { message: "Image is required" }),
  categoryId: z.string().min(1, "Please select a bravo category"),
});

export type BravoUploadSchemaType = z.infer<typeof bravoUploadSchema>;
