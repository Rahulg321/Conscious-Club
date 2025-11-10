import { z } from "zod";

const mediaFileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number(),
  })
  .refine((file) => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    return [...imageTypes, ...videoTypes].includes(file.mimetype);
  }, "Only images (JPEG, JPG, PNG, WebP) or videos (MP4, WebM, MOV) are allowed")
  .refine((file) => {
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (videoTypes.includes(file.mimetype)) {
      return file.size <= 200 * 1024 * 1024; // 200MB for videos
    }
    return file.size <= 20 * 1024 * 1024; // 20MB for images
  }, "File size exceeds the maximum allowed size (20MB for images, 200MB for videos)");

const coverImageFileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number(),
  })
  .refine((file) => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return imageTypes.includes(file.mimetype);
  }, "Cover image must be JPEG, JPG, PNG, or WebP")
  .refine(
    (file) => file.size <= 20 * 1024 * 1024,
    "Cover image size must be less than 20MB"
  );

export const projectUploadSchema = z.object({
  coverImage: coverImageFileSchema,
  media: z
    .array(mediaFileSchema)
    .min(1, "At least one media file is required")
    .max(4, "You can upload up to 4 media files"),
  projectName: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  projectDescription: z
    .union([
      z.string().max(500, "Project description must be less than 500 characters").min(10, "Project description must be at least 10 characters if provided"),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),
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
});

export type ProjectUploadFormData = z.infer<typeof projectUploadSchema>;
