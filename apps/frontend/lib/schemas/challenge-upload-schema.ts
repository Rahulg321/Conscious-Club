import { z } from "zod";

export const challengeUploadSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be less than 64 characters"),
  description: z.string().optional(),
  bannerImage: z.instanceof(File, { message: "Banner image is required" }),
  deadline: z.string().min(1, "Deadline is required"),
  reward: z.string().optional(),
  prizePool: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const challengeUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(64, "Name must be less than 64 characters"),
  description: z.string().optional(),
  bannerImage: z.union([z.instanceof(File), z.undefined()]).optional(),
  deadline: z.string().min(1, "Deadline is required"),
  reward: z.string().optional(),
  prizePool: z.string().optional(),
  isActive: z.boolean(),
});

export type ChallengeUploadSchemaType = z.infer<typeof challengeUploadSchema>;
export type ChallengeUpdateSchemaType = z.infer<typeof challengeUpdateSchema>;
