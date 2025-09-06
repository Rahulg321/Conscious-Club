import { z } from "zod";

export const profilePicUploadSchema = z.object({
  profilePic: z
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

export type ProfilePicUploadSchemaType = z.infer<typeof profilePicUploadSchema>;
