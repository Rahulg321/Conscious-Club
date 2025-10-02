"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { bravoCategories } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function adminDeleteBravoCategory(categoryId: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  if (!categoryId) {
    return { success: false, message: "category id is not defined" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "user is not an admin" };
  }

  try {
    await db.delete(bravoCategories).where(eq(bravoCategories.id, categoryId));
    revalidatePath("/admin");
    revalidatePath("/admin/bravo-categories");
    revalidatePath("/bravos");
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting bravo category:", error);
    return { success: false, message: "Failed to delete category" };
  }
}
