import { z } from "zod";

export const projectUploadSchema = z.object({
  projectCover: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Only JPEG, JPG, and PNG files are allowed"
    ),
  projectName: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  projectDescription: z
    .string()
    .min(1, "Project description is required")
    .min(10, "Project description must be at least 10 characters")
    .max(500, "Project description must be less than 500 characters"),
  projectLink: z
    .string()
    .min(1, "Project link is required")
    .url("Please enter a valid URL"),
});

export type ProjectUploadFormData = z.infer<typeof projectUploadSchema>;
