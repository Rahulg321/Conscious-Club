"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { blogTags } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import {
  blogTagSchema,
  editBlogTagSchema,
  type BlogTagSchemaType,
  type EditBlogTagSchemaType,
} from "../schemas/blog-tags-schema";
import slugify from "slugify";
import { eq } from "drizzle-orm";

export async function adminAddBlogTag(values: BlogTagSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = blogTagSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.name, {
      lower: true,
      strict: true,
    });

    await db.insert(blogTags).values({
      name: validatedData.data.name,
      slug: slug,
      description: validatedData.data.description,
    });

    revalidatePath("/admin/add-blog-tags");
    revalidatePath("/blog");
    return { success: true, message: "Blog tag added successfully" };
  } catch (error) {
    console.error("Error adding blog tag:", error);
    return {
      success: false,
      message: "Failed to add blog tag. Tag name may already exist.",
    };
  }
}

export async function adminEditBlogTag(values: EditBlogTagSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = editBlogTagSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.name, {
      lower: true,
      strict: true,
    });

    await db
      .update(blogTags)
      .set({
        name: validatedData.data.name,
        slug: slug,
        description: validatedData.data.description,
      })
      .where(eq(blogTags.id, validatedData.data.id));

    revalidatePath("/admin/add-blog-tags");
    revalidatePath("/blog");
    return { success: true, message: "Blog tag updated successfully" };
  } catch (error) {
    console.error("Error updating blog tag:", error);
    return {
      success: false,
      message: "Failed to update blog tag. Tag name may already exist.",
    };
  }
}

export async function adminDeleteBlogTag(id: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  if (!id) {
    return { success: false, message: "Tag ID is required" };
  }

  try {
    await db.delete(blogTags).where(eq(blogTags.id, id));

    revalidatePath("/admin/add-blog-tags");
    revalidatePath("/blog");
    return { success: true, message: "Blog tag deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog tag:", error);
    return { success: false, message: "Failed to delete blog tag" };
  }
}
