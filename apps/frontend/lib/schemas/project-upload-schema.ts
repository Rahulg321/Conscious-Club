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

const videoFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 50 * 1024 * 1024,
    "Video size must be less than 50MB"
  )
  .refine(
    (file) =>
      ["video/mp4", "video/webm", "video/quicktime"].includes(file.type),
    "Only MP4, WebM, and MOV video files are allowed"
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
  dedicatedToPerson: z
    .string()
    .max(100, "Person name must be less than 100 characters")
    .optional(),
  dedicatedToBrand: z
    .string()
    .max(100, "Brand name must be less than 100 characters")
    .optional(),
  dedicatedToCause: z
    .string()
    .max(100, "Cause name must be less than 100 characters")
    .optional(),
  additionalImages: z
    .array(imageFileSchema)
    .max(5, "You can upload up to 5 additional images")
    .optional(),
  coverVideo: videoFileSchema.optional(),
  videoDuration: z.number().optional(),
});

export type ProjectUploadFormData = z.infer<typeof projectUploadSchema>;
