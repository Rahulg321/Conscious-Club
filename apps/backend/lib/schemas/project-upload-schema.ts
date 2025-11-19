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
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  projectDescription: z
    .union([
      z
        .string()
        .max(500, "Description must be less than 500 characters")
        .min(10, "Description must be at least 10 characters if provided"),
      z.literal(""),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .transform((val) => val || undefined),
  projectLink: z
    .union([z.string().url("Please enter a valid URL"), z.literal(""), z.null()])
    .optional()
    .transform((val) => val || undefined),
  dedicatedToPerson: z
    .union([z.string().max(100, "Name must be less than 100 characters"), z.literal(""), z.null()])
    .optional()
    .transform((val) => val || undefined),
  dedicatedToBrand: z
    .union([z.string().max(100, "Name must be less than 100 characters"), z.literal(""), z.null()])
    .optional()
    .transform((val) => val || undefined),
  dedicatedToCause: z
    .union([z.string().max(100, "Name must be less than 100 characters"), z.literal(""), z.null()])
    .optional()
    .transform((val) => val || undefined),
  dedicationReason: z
    .union([z.string().max(200, "Reason must be less than 200 characters"), z.literal(""), z.null()])
    .optional()
    .transform((val) => val || undefined),
});

export type ProjectUploadFormData = z.infer<typeof projectUploadSchema>;
