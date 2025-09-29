import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  bio: z.string().max(280, "Bio must be at most 280 characters"),
  location: z.string().max(120, "Location must be at most 120 characters"),
});

export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
