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
      return file.size <= 50 * 1024 * 1024; // 50MB for videos
    }
    return file.size <= 5 * 1024 * 1024; // 5MB for images
  }, "File size exceeds the maximum allowed size (5MB for images, 50MB for videos)");

export const challengeEntrySchema = z.object({
  media: mediaFileSchema,
  challengeId: z.string().min(1, "Challenge ID is required"),
  caption: z
    .string()
    .min(1, "Caption is required")
    .min(10, "Caption must be at least 10 characters")
    .max(500, "Caption must be less than 500 characters"),
});

export type ChallengeEntryFormData = z.infer<typeof challengeEntrySchema>;

