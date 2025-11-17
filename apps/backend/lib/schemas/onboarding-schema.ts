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

export const onboardingSchema = z
  .object({
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
    city: z
      .string()
      .min(1, "City is required")
      .min(2, "City must be at least 2 characters")
      .max(100, "City must be less than 100 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .min(2, "Country must be at least 2 characters")
      .max(100, "Country must be less than 100 characters"),
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
        // Check if it's a valid date and not in the future
        return date instanceof Date && !isNaN(date.getTime()) && date <= now;
      }, "Please enter a valid date of birth")
      .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        const monthDiff = now.getMonth() - date.getMonth();
        const dayDiff = now.getDate() - date.getDate();

        // Calculate actual age accounting for month and day
        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
          ? age - 1
          : age;

        return actualAge >= 13;
      }, "You must be at least 13 years old to use this platform"),
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
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters")
      .optional(),
    projectDescription: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional()
      .refine((val) => {
        // Allow undefined, empty string, or strings with at least 10 characters
        if (!val || val.trim().length === 0) return true;
        return val.trim().length >= 10;
      }, "Description must be at least 10 characters if provided"),
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
      .max(100, "Name must be less than 100 characters")
      .optional(),
    dedicatedToBrand: z
      .string()
      .max(100, "Name must be less than 100 characters")
      .optional(),
    dedicatedToCause: z
      .string()
      .max(100, "Name must be less than 100 characters")
      .optional(),
    dedicationReason: z
      .string()
      .max(200, "Reason must be less than 200 characters")
      .optional(),
  })
  .refine(
    (data) => {
      // Check if any project field is filled
      const hasAnyProjectField =
        (data.coverImage && data.coverImage.length > 0) ||
        (data.projectMedia && data.projectMedia.length > 0) ||
        (data.projectName && data.projectName.trim() !== "") ||
        (data.projectDescription && data.projectDescription.trim() !== "") ||
        (data.projectLink && data.projectLink.trim() !== "") ||
        (data.dedicatedToPerson && data.dedicatedToPerson.trim() !== "") ||
        (data.dedicatedToBrand && data.dedicatedToBrand.trim() !== "") ||
        (data.dedicatedToCause && data.dedicatedToCause.trim() !== "") ||
        (data.dedicationReason && data.dedicationReason.trim() !== "");

      // If any project field is filled, require all required fields (except description which is optional)
      if (hasAnyProjectField) {
        const hasCoverImage = data.coverImage && data.coverImage.length > 0;
        const hasProjectName =
          data.projectName && data.projectName.trim().length >= 3;

        return hasCoverImage && hasProjectName;
      }

      // If no project fields are filled, validation passes
      return true;
    },
    {
      message:
        "If any creation field is filled, cover image and name (min 3 characters) are required",
      path: ["projectName"], // Set error path to projectName for better UX
    }
  );

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
