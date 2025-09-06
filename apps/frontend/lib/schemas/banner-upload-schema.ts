import { z } from "zod";

export const bannerUploadSchema = z.object({
  banner: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5000000,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Only JPEG, PNG and WebP images are allowed"
    ),
});

export type BannerUploadSchemaType = z.infer<typeof bannerUploadSchema>;
