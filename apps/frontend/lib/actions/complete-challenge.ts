"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { challenges } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function completeChallenge(challengeId: string) {
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

    if (challenge.isCompleted) {
      return { success: false, message: "Challenge is already completed" };
    }

    // Mark challenge as completed and set isActive to false
    await db
      .update(challenges)
      .set({
        isCompleted: true,
        completedAt: new Date(),
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, challengeId));

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    revalidatePath("/challenges");

    return {
      success: true,
      message: "Challenge completed successfully. Entries are now closed.",
    };
  } catch (error) {
    console.error("Error completing challenge:", error);
    return { success: false, message: "Failed to complete challenge" };
  }
}

