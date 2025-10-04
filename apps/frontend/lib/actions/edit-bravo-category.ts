"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { bravoCategories } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  bravoCategorySchema,
  BravoCategorySchemaType,
} from "../schemas/bravo-category-schema";
import slugify from "slugify";

export async function adminEditBravoCategory(
  categoryId: string,
  values: BravoCategorySchemaType
) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "user is not an admin" };
  }

  if (!categoryId) {
    return { success: false, message: "category id is not defined" };
  }

  const validatedData = bravoCategorySchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    await db
      .update(bravoCategories)
      .set({
        name: validatedData.data.name,
        slug: slugify(validatedData.data.name, { lower: true }),
        description: validatedData.data.description,
      })
      .where(eq(bravoCategories.id, categoryId));

    revalidatePath("/admin");
    revalidatePath("/admin/bravo-categories");
    revalidatePath("/bravos");
    return { success: true, message: "Bravo category updated successfully" };
  } catch (error) {
    console.error("Error updating bravo category:", error);
    return { success: false, message: "Failed to update bravo category" };
  }
}
