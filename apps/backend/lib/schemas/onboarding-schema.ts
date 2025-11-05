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

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  gender: z.enum(
    ["male", "female", "non-binary", "other", "prefer_not_to_say"],
    {
      message: "Please select your gender",
    }
  ),
  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  socialMediaUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid URL"
    ),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      // Just check if it's a valid date and not in the future
      return date instanceof Date && !isNaN(date.getTime()) && date <= now;
    }, "Please enter a valid date of birth"),
  userRole: z.enum(["creator"], {
    message: "User role is required",
  }),

  // Creator-specific fields
  discipline: z
    .string()
    .min(1, "Discipline is required")
    .min(2, "Discipline must be at least 2 characters")
    .max(50, "Discipline must be less than 50 characters"),
  role: z
    .string()
    .min(1, "Role is required")
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be less than 50 characters"),

  // Profile picture (optional)
  profilePicture: z
    .array(mediaFileSchema)
    .max(1, "Only one profile picture is allowed")
    .optional(),

  // Project data (optional for onboarding)
  projectName: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters")
    .optional(),
  projectDescription: z
    .string()
    .min(10, "Project description must be at least 10 characters")
    .max(500, "Project description must be less than 500 characters")
    .optional(),
  projectLink: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid URL"
    ),
  projectMedia: z
    .array(mediaFileSchema)
    .max(4, "You can upload up to 4 media files")
    .optional(),
  coverImage: z
    .array(mediaFileSchema)
    .max(1, "Only one cover image is allowed")
    .optional(),

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

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
