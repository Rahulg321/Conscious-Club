"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { bravos } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adminDeleteBravo(bravoId: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  if (!bravoId) {
    return { success: false, message: "bravo id is not defined" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "user is not an admin" };
  }

  try {
    await db.delete(bravos).where(eq(bravos.id, bravoId));
    revalidatePath("/admin");
    revalidatePath("/bravos");
    return { success: true, message: "Bravo deleted successfully" };
  } catch (error) {
    console.error("Error deleting bravo:", error);
    return { success: false, message: "Failed to delete bravo" };
  }
}
