"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { bravos, user } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function pinBravo(bravoId: string) {
  const userSession = await auth();
  if (!userSession) {
    return { error: "You must be logged in to pin bravos" };
  }

  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        moodSelectedBravoId: bravoId as string,
      })
      .where(eq(user.id, userSession.user.id))
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    revalidatePath("/profile/:id");

    return { success: "Bravo pinned successfully" };
  } catch (error) {
    console.error("Error pinning bravo:", error);
    return { error: "Failed to pin bravo" };
  }

  return { success: "Bravo pinned successfully" };
}
