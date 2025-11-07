import { auth } from "@/auth";
import { db } from "@repo/db";
import { projectLikes, project } from "@repo/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const { isLiked } = await req.json();

    console.log("is project id", projectId);
    console.log("is project id", isLiked);

    if (typeof isLiked !== "boolean") {
      return NextResponse.json(
        { error: "isLiked must be a boolean" },
        { status: 400 }
      );
    }

    // Check if project exists
    const [existingProject] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const userId = userSession.user.id;

    if (isLiked) {
      // Add like
      try {
        await db.insert(projectLikes).values({
          userId,
          projectId,
        });
      } catch (error) {
        // If the like already exists, that's fine - just continue
        console.log("Like already exists or error adding like:", error);
      }
    } else {
      // Remove like
      await db
        .delete(projectLikes)
        .where(
          and(
            eq(projectLikes.userId, userId),
            eq(projectLikes.projectId, projectId)
          )
        );
    }

    // Get updated like count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(projectLikes)
      .where(eq(projectLikes.projectId, projectId));

    const likeCount = likeCountResult?.count || 0;

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
};
