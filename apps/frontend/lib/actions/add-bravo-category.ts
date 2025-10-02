"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { bravoCategories } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import {
  bravoCategorySchema,
  BravoCategorySchemaType,
} from "../schemas/bravo-category-schema";
import slugify from "slugify";

export async function adminAddBravoCategory(values: BravoCategorySchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "user is not an admin" };
  }

  const validatedData = bravoCategorySchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    await db.insert(bravoCategories).values({
      name: validatedData.data.name,
      slug: slugify(validatedData.data.name, { lower: true }),
      description: validatedData.data.description,
    });
    revalidatePath("/admin");
    revalidatePath("/bravo-categories");
    revalidatePath("/bravos");
    return { success: true, message: "Bravo category added successfully" };
  } catch (error) {
    console.error("Error adding bravo category:", error);
    return { success: false, message: "Failed to add bravo category" };
  }
}
