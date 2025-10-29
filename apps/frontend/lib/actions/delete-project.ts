"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 *
 * @param projectId
 * @returns
 */
export async function deleteProject(projectId: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "user is not authenticated" };
  }

  if (!projectId) {
    return { success: false, message: "project id is not defined" };
  }

  try {
    const deleted = await db.delete(project).where(eq(project.id, projectId));

    revalidatePath("/profile/" + userSession.user.id);
    revalidatePath("/discover");

    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete project" };
  }
}
