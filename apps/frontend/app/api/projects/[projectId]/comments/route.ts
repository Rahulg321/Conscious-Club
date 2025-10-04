import { NextResponse } from "next/server";
import { db } from "@repo/db";
import { projectComments, user } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  try {
    // Fetch the latest 5 comments for the project with user information
    const comments = await db
      .select({
        id: projectComments.id,
        content: projectComments.content,
        createdAt: projectComments.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(projectComments)
      .innerJoin(user, eq(projectComments.userId, user.id))
      .where(eq(projectComments.projectId, projectId))
      .orderBy(desc(projectComments.createdAt))
      .limit(5);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching project comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
