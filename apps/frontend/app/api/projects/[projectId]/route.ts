import { NextResponse } from "next/server";
import { db } from "@repo/db";
import { project, projectTags, tags, projectLikes } from "@repo/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  try {
    const [p] = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));
    if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const tagRows = await db
      .select({ name: tags.name })
      .from(projectTags)
      .leftJoin(tags, eq(projectTags.tagId, tags.id))
      .where(eq(projectTags.projectId, projectId));

    const [likesRow] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(projectLikes)
      .where(eq(projectLikes.projectId, projectId));

    // Get user session to check if user has liked this project
    const userSession = await auth();
    let isLiked = false;

    if (userSession?.user?.id) {
      const [userLike] = await db
        .select()
        .from(projectLikes)
        .where(
          and(
            eq(projectLikes.projectId, projectId),
            eq(projectLikes.userId, userSession.user.id)
          )
        );
      isLiked = !!userLike;
    }

    const payload = {
      id: p.id,
      name: p.name,
      description: p.description,
      media: p.media,
      logoImage: p.logoImage,
      link: p.link,
      dedicatedToPerson: p.dedicatedToPerson,
      dedicatedToBrand: p.dedicatedToBrand,
      dedicatedToCause: p.dedicatedToCause,
      dedicationReason: p.dedicationReason,
      tags: tagRows.map((t) => t.name).filter(Boolean) as string[],
      likeCount: Number(likesRow?.count || 0),
      isLiked,
    };

    return NextResponse.json({ project: payload });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
