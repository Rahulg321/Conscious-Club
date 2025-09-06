import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { profilePicUploadSchema } from "@/lib/schemas/profile-pic-upload-schema";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { user } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const profilePic = formData.get("profilePic");

  if (!profilePic) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const validatedData = profilePicUploadSchema.safeParse({
    profilePic,
  });

  if (!validatedData.success) {
    console.log("invalid format");

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  const url = await uploadFile(profilePic as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );

  console.log("the url is also working", url);

  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        image: url,
      })
      .where(eq(user.id, userSession.user.id))
      .returning();

    revalidatePath(`/profile`);
    revalidatePath(`/profile/${userSession.user.id}`);

    return NextResponse.json({ success: true, updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user profile pic" },
      { status: 500 }
    );
  }
};
