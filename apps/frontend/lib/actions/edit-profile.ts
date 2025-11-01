"use server";

import { auth } from "@/auth";
import {
  editProfileSchema,
  EditProfileSchemaType,
} from "../schemas/edit-profile-schema";
import { user } from "@repo/db/schema";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { rateLimit } from "../redis";
import { getClientIp } from "../utils/rate-limit";

export async function EditUserProfile(values: EditProfileSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  // Rate limiting: 20 profile edits per hour per user, with IP fallback
  const ip = await getClientIp();
  const { ok, remaining, reset } = await rateLimit(
    `edit-profile:${userSession.user.id}:${ip}`,
    20, // 20 profile edits per hour
    60 * 60 * 1000 // 1 hour
  );

  if (!ok) {
    return {
      success: false,
      message: "Rate limit exceeded. Please try again later.",
      resetTime: new Date(reset).toISOString(),
    };
  }

  const validatedData = editProfileSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const updatedUser = await db
      .update(user)
      .set({
        name: validatedData.data.name,
        bio: validatedData.data.bio,
        location: validatedData.data.location,
      })
      .where(eq(user.id, userSession.user.id))
      .returning();

    revalidatePath(`/profile`);
    revalidatePath(`/profile/${userSession.user.id}`);

    return { success: true, updatedUser };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update user profile" };
  }
}
