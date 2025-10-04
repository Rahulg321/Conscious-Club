"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { projectComments } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import {
  projectCommentSchema,
  ProjectCommentSchemaType,
} from "@/lib/schemas/project-comment-schema";

export async function addProjectComment(values: ProjectCommentSchemaType) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "User is not authenticated" };
  }

  if (!userSession.user?.id) {
    return { success: false, message: "User ID is not available" };
  }

  try {
    // Validate the input data
    const validatedData = projectCommentSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid comment data",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Insert the comment into the database
    await db.insert(projectComments).values({
      userId: userSession.user.id,
      projectId: validatedData.data.projectId,
      content: validatedData.data.content,
    });

    // Revalidate the project page to show the new comment
    revalidatePath(`/projects/${validatedData.data.projectId}`);
    revalidatePath("/discover");
    revalidatePath("/community");

    return { success: true, message: "Comment added successfully" };
  } catch (error) {
    console.error("Error adding project comment:", error);
    return { success: false, message: "Failed to add comment" };
  }
}
