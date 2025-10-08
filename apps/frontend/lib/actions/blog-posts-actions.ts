"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { blogPosts, blogPostTags } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import {
  blogPostSchema,
  editBlogPostSchema,
  type BlogPostSchemaType,
  type EditBlogPostSchemaType,
} from "../schemas/blog-posts-schema";
import slugify from "slugify";
import { eq, and } from "drizzle-orm";

// Helper function to calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Helper function to count words
function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}

export async function adminAddBlogPost(values: BlogPostSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = blogPostSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.title, {
      lower: true,
      strict: true,
    });

    // Calculate reading time and word count if not provided
    const wordCount =
      validatedData.data.wordCount || countWords(validatedData.data.content);
    const readingTime =
      validatedData.data.readingTime ||
      calculateReadingTime(validatedData.data.content);

    // Prepare the blog post data
    const postData: any = {
      title: validatedData.data.title,
      slug: slug,
      content: validatedData.data.content,
      status: validatedData.data.status,
      isPublished: validatedData.data.isPublished,
      readingTime: readingTime,
      wordCount: wordCount,
    };

    // Add optional fields only if they exist
    if (validatedData.data.excerpt) {
      postData.excerpt = validatedData.data.excerpt;
    }
    if (validatedData.data.metaTitle) {
      postData.metaTitle = validatedData.data.metaTitle;
    }
    if (validatedData.data.metaDescription) {
      postData.metaDescription = validatedData.data.metaDescription;
    }
    if (validatedData.data.metaKeywords) {
      postData.metaKeywords = validatedData.data.metaKeywords;
    }
    if (validatedData.data.canonicalUrl) {
      postData.canonicalUrl = validatedData.data.canonicalUrl;
    }
    if (validatedData.data.featuredImage) {
      postData.featuredImage = validatedData.data.featuredImage;
    }
    if (validatedData.data.featuredImageAlt) {
      postData.featuredImageAlt = validatedData.data.featuredImageAlt;
    }
    if (
      validatedData.data.categoryId &&
      validatedData.data.categoryId !== "none"
    ) {
      postData.categoryId = validatedData.data.categoryId;
    }

    // Set publishedAt if the post is published
    if (validatedData.data.isPublished) {
      postData.publishedAt = new Date();
    }

    // Insert the blog post
    const [insertedPost] = await db
      .insert(blogPosts)
      .values(postData)
      .returning();

    // Insert tags if provided
    if (validatedData.data.tagIds && validatedData.data.tagIds.length > 0) {
      const tagValues = validatedData.data.tagIds.map((tagId) => ({
        postId: insertedPost?.id || "",
        tagId: tagId,
      }));
      await db.insert(blogPostTags).values(tagValues);
    }

    revalidatePath("/admin/add-blog-posts");
    revalidatePath("/blog");
    return { success: true, message: "Blog post added successfully" };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return {
      success: false,
      message: "Failed to add blog post. Title may already exist.",
    };
  }
}

export async function adminEditBlogPost(values: EditBlogPostSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  const validatedData = editBlogPostSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const slug = slugify(validatedData.data.title, {
      lower: true,
      strict: true,
    });

    // Calculate reading time and word count if not provided
    const wordCount =
      validatedData.data.wordCount || countWords(validatedData.data.content);
    const readingTime =
      validatedData.data.readingTime ||
      calculateReadingTime(validatedData.data.content);

    // Prepare the blog post data
    const postData: any = {
      title: validatedData.data.title,
      slug: slug,
      content: validatedData.data.content,
      status: validatedData.data.status,
      isPublished: validatedData.data.isPublished,
      readingTime: readingTime,
      wordCount: wordCount,
      updatedAt: new Date(),
    };

    // Add optional fields only if they exist
    if (validatedData.data.excerpt) {
      postData.excerpt = validatedData.data.excerpt;
    }
    if (validatedData.data.metaTitle) {
      postData.metaTitle = validatedData.data.metaTitle;
    }
    if (validatedData.data.metaDescription) {
      postData.metaDescription = validatedData.data.metaDescription;
    }
    if (validatedData.data.metaKeywords) {
      postData.metaKeywords = validatedData.data.metaKeywords;
    }
    if (validatedData.data.canonicalUrl) {
      postData.canonicalUrl = validatedData.data.canonicalUrl;
    }
    if (validatedData.data.featuredImage) {
      postData.featuredImage = validatedData.data.featuredImage;
    }
    if (validatedData.data.featuredImageAlt) {
      postData.featuredImageAlt = validatedData.data.featuredImageAlt;
    }
    if (
      validatedData.data.categoryId &&
      validatedData.data.categoryId !== "none"
    ) {
      postData.categoryId = validatedData.data.categoryId;
    }

    // Update publishedAt if the post is being published for the first time
    const [existingPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, validatedData.data.id));

    if (validatedData.data.isPublished && !existingPost?.publishedAt) {
      postData.publishedAt = new Date();
    }

    // Update the blog post
    await db
      .update(blogPosts)
      .set(postData)
      .where(eq(blogPosts.id, validatedData.data.id));

    // Update tags - delete existing and insert new ones
    await db
      .delete(blogPostTags)
      .where(eq(blogPostTags.postId, validatedData.data.id));

    if (validatedData.data.tagIds && validatedData.data.tagIds.length > 0) {
      const tagValues = validatedData.data.tagIds.map((tagId) => ({
        postId: validatedData.data.id,
        tagId: tagId,
      }));
      await db.insert(blogPostTags).values(tagValues);
    }

    revalidatePath("/admin/add-blog-posts");
    revalidatePath("/blog");
    return { success: true, message: "Blog post updated successfully" };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return {
      success: false,
      message: "Failed to update blog post. Title may already exist.",
    };
  }
}

export async function adminDeleteBlogPost(id: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  if (!id) {
    return { success: false, message: "Post ID is required" };
  }

  try {
    // Delete the blog post (tags will be deleted automatically due to cascade)
    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    revalidatePath("/admin/add-blog-posts");
    revalidatePath("/blog");
    return { success: true, message: "Blog post deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, message: "Failed to delete blog post" };
  }
}

export async function adminToggleBlogPostPublishStatus(
  id: string,
  isPublished: boolean
) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user.isAdmin) {
    return { success: false, message: "User is not an admin" };
  }

  if (!id) {
    return { success: false, message: "Post ID is required" };
  }

  try {
    const updateData: any = {
      isPublished: isPublished,
      status: isPublished ? "published" : "draft",
      updatedAt: new Date(),
    };

    // Set publishedAt if publishing for the first time
    if (isPublished) {
      const [existingPost] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id));

      if (!existingPost?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

    revalidatePath("/admin/add-blog-posts");
    revalidatePath("/blog");
    return {
      success: true,
      message: `Blog post ${isPublished ? "published" : "unpublished"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling blog post publish status:", error);
    return {
      success: false,
      message: "Failed to update blog post publish status",
    };
  }
}
