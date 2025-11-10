import { z } from "zod";

const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "Image size must be less than 5MB"
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

const mediaFileSchema = z
  .instanceof(File)
  .refine((file) => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    return [...imageTypes, ...videoTypes].includes(file.type);
  }, "Only images (JPEG, JPG, PNG, WebP) or videos (MP4, WebM, MOV) are allowed")
  .refine((file) => {
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (videoTypes.includes(file.type)) {
      return file.size <= 50 * 1024 * 1024; // 50MB for videos
    }
    return file.size <= 5 * 1024 * 1024; // 5MB for images
  }, "File size exceeds the maximum allowed size (5MB for images, 50MB for videos)");

const coverImageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 20 * 1024 * 1024,
    "Cover image size must be less than 20MB"
  )
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      ),
    "Cover image must be JPEG, JPG, PNG, or WebP"
  );

export const mashupProjectUploadSchema = z.object({
  coverImage: coverImageFileSchema,
  media: z
    .array(mediaFileSchema)
    .min(1, "At least one media file is required")
    .max(1, "Only one media file is allowed"),
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
  dedicationReason: z
    .string()
    .max(200, "Dedication reason must be less than 200 characters")
    .optional(),
  collaboratorId: z.string().min(1, "Collaborator ID is required"),
});

export type MashupProjectUploadFormData = z.infer<
  typeof mashupProjectUploadSchema
>;
