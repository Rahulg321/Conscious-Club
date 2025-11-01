import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { challengeUploadSchema } from "@/lib/schemas/challenge-upload-schema";
import { db } from "@repo/db";
import { challenges } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const deadline = formData.get("deadline");
  const reward = formData.get("reward");
  const prizePool = formData.get("prizePool");
  const isActive = formData.get("isActive");
  const bannerImage = formData.get("bannerImage");

  if (!name || !deadline || !bannerImage) {
    return NextResponse.json(
      { error: "Name, deadline, and banner image are required" },
      { status: 400 }
    );
  }

  const validatedData = challengeUploadSchema.safeParse({
    name,
    description: description || undefined,
    deadline,
    reward: reward || undefined,
    prizePool: prizePool ? Number(prizePool) : 0,
    isActive: isActive === "true",
    bannerImage,
  });

  if (!validatedData.success) {
    console.log("Invalid format:", validatedData.error.message);

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  const url = await uploadFile(bannerImage as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload banner image" },
      { status: 500 }
    );

  console.log("Banner image uploaded successfully:", url);

  try {
    const [newChallenge] = await db
      .insert(challenges)
      .values({
        name: validatedData.data.name,
        slug: slugify(validatedData.data.name, { lower: true }),
        description: validatedData.data.description || null,
        deadline: new Date(validatedData.data.deadline),
        reward: validatedData.data.reward || null,
        prizePool: validatedData.data.prizePool
          ? Number(validatedData.data.prizePool)
          : 0,
        isActive: validatedData.data.isActive,
        bannerImage: url,
      })
      .returning();

    revalidatePath("/admin/challenges");
    revalidatePath("/challenges");

    return NextResponse.json({ success: true, challenge: newChallenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
};
