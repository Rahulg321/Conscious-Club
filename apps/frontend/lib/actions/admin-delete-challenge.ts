"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { challenges } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adminDeleteChallenge(challengeId: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  if (!challengeId) {
    return { success: false, message: "Challenge ID is required" };
  }

  try {
    // Check if challenge exists
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1);

    if (!challenge) {
      return { success: false, message: "Challenge not found" };
    }

    // Delete the challenge (entries will be deleted automatically due to cascade)
    await db.delete(challenges).where(eq(challenges.id, challengeId));

    revalidatePath("/admin/challenges");
    revalidatePath("/challenges");

    return { success: true, message: "Challenge deleted successfully" };
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return { success: false, message: "Failed to delete challenge" };
  }
}

