"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { rateLimit } from "../redis";
import { getClientIp } from "../utils/rate-limit";

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

  // Rate limiting: 10 project deletions per hour per user, with IP fallback
  const ip = await getClientIp();
  const { ok, remaining, reset } = await rateLimit(
    `delete-project:${userSession.user.id}:${ip}`,
    10, // 10 deletions per hour
    60 * 60 * 1000 // 1 hour
  );

  if (!ok) {
    return {
      success: false,
      message: "Rate limit exceeded. Please try again later.",
      resetTime: new Date(reset).toISOString(),
    };
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
