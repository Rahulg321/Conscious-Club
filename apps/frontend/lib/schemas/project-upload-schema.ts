import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      ),
    "Only JPEG, JPG, PNG, and WebP files are allowed"
  );

export const projectUploadSchema = z.object({
  projectCover: imageFileSchema,
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
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid URL"
    ),
  tagId: z.string().min(1, "Please select a tag").uuid("Invalid tag selected"),
  additionalImages: z
    .array(imageFileSchema)
    .max(5, "You can upload up to 5 additional images")
    .optional(),
});

export type ProjectUploadFormData = z.infer<typeof projectUploadSchema>;
