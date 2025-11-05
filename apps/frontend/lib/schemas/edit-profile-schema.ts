import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  bio: z.string().max(280, "Bio must be at most 280 characters"),
  city: z.string().max(100, "City must be at most 100 characters"),
  country: z.string().max(100, "Country must be at most 100 characters"),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
