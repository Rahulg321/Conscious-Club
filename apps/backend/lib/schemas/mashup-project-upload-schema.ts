import { z } from "zod";
import { projectUploadSchema } from "./project-upload-schema";

// Import mediaFileSchema to override media field
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

// Extends the standard project upload schema to require collaboratorId and limit media to 1 file
export const mashupProjectUploadSchema = projectUploadSchema.extend({
  collaboratorId: z.string().min(1, "Collaborator ID is required"),
  media: z
    .array(mediaFileSchema)
    .min(1, "At least one media file is required")
    .max(1, "Only one media file is allowed"),
});

export type MashupProjectUploadData = z.infer<typeof mashupProjectUploadSchema>;


