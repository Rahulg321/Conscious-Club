import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { challengeUpdateSchema } from "@/lib/schemas/challenge-upload-schema";
import { db } from "@repo/db";
import { challenges } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const deadline = formData.get("deadline");
  const reward = formData.get("reward");
  const prizePool = formData.get("prizePool");
  const isActive = formData.get("isActive");
  const bannerImage = formData.get("bannerImage");

  if (!name || !deadline) {
    return NextResponse.json(
      { error: "Name and deadline are required" },
      { status: 400 }
    );
  }

  // Get existing challenge
  const [existingChallenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, id))
    .limit(1);

  if (!existingChallenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Validate the data (bannerImage is optional for updates)
  const validatedData = challengeUpdateSchema.safeParse({
    name,
    description: description || undefined,
    deadline,
    reward: reward || undefined,
    prizePool: prizePool || "0",
    isActive: isActive === "true",
    bannerImage: bannerImage instanceof File ? bannerImage : undefined,
  });

  if (!validatedData.success) {
    console.log("Invalid format:", validatedData.error.message);
    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  try {
    // Upload new banner image if provided
    let bannerImageUrl = existingChallenge.bannerImage;
    if (bannerImage instanceof File && bannerImage.size > 0) {
      const url = await uploadFile(bannerImage);
      if (!url) {
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500 }
        );
      }
      bannerImageUrl = url;
    }

    // Update challenge
    const [updatedChallenge] = await db
      .update(challenges)
      .set({
        name: validatedData.data.name,
        slug: slugify(validatedData.data.name, { lower: true }),
        description: validatedData.data.description || null,
        deadline: new Date(validatedData.data.deadline),
        reward: validatedData.data.reward || null,
        prizePool: validatedData.data.prizePool
          ? Number(validatedData.data.prizePool)
          : 0,
        isActive: validatedData.data.isActive,
        bannerImage: bannerImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, id))
      .returning();

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${id}`);
    revalidatePath("/challenges");

    return NextResponse.json({ success: true, challenge: updatedChallenge });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
};
