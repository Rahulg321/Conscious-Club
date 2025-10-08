"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { blogCategories } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import {
  blogCategorySchema,
  editBlogCategorySchema,
  type BlogCategorySchemaType,
  type EditBlogCategorySchemaType,
} from "../schemas/blog-categories-schema";
import slugify from "slugify";
import { eq } from "drizzle-orm";

export async function adminAddBlogCategory(values: BlogCategorySchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = blogCategorySchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.name, {
      lower: true,
      strict: true,
    });

    await db.insert(blogCategories).values({
      name: validatedData.data.name,
      slug: slug,
      description: validatedData.data.description,
    });

    revalidatePath("/admin/add-blog-categories");
    revalidatePath("/blog");
    return { success: true, message: "Blog category added successfully" };
  } catch (error) {
    console.error("Error adding blog category:", error);
    return {
      success: false,
      message: "Failed to add blog category. Category name may already exist.",
    };
  }
}

export async function adminEditBlogCategory(
  values: EditBlogCategorySchemaType
) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = editBlogCategorySchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.name, {
      lower: true,
      strict: true,
    });

    await db
      .update(blogCategories)
      .set({
        name: validatedData.data.name,
        slug: slug,
        description: validatedData.data.description,
      })
      .where(eq(blogCategories.id, validatedData.data.id));

    revalidatePath("/admin/add-blog-categories");
    revalidatePath("/blog");
    return { success: true, message: "Blog category updated successfully" };
  } catch (error) {
    console.error("Error updating blog category:", error);
    return {
      success: false,
      message:
        "Failed to update blog category. Category name may already exist.",
    };
  }
}

export async function adminDeleteBlogCategory(id: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  if (!id) {
    return { success: false, message: "Category ID is required" };
  }

  try {
    await db.delete(blogCategories).where(eq(blogCategories.id, id));

    revalidatePath("/admin/add-blog-categories");
    revalidatePath("/blog");
    return { success: true, message: "Blog category deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return { success: false, message: "Failed to delete blog category" };
  }
}
