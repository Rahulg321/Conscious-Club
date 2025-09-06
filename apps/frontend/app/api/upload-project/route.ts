import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { projectUploadSchema } from "@/lib/schemas/project-upload-schema";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const projectCover = formData.get("projectCover");
  const projectName = formData.get("projectName");
  const projectDescription = formData.get("projectDescription");
  const projectLink = formData.get("projectLink");

  if (!projectCover)
    return NextResponse.json({ error: "File is required" }, { status: 400 });

  const validatedData = projectUploadSchema.safeParse({
    projectCover,
    projectName,
    projectDescription,
    projectLink,
  });

  if (!validatedData.success) {
    console.log("invalid format");

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  const url = await uploadFile(projectCover as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );

  console.log("the url is also working", url);

  try {
    const [insertedProject] = await db
      .insert(project)
      .values({
        name: validatedData.data.projectName,
        link: validatedData.data.projectLink as string,
        description: validatedData.data.projectDescription,
        coverImage: url,
        userId: userSession.user.id,
      })
      .returning();

    revalidatePath(`/profile`);
    revalidatePath(`/profile/${userSession.user.id}`);

    return NextResponse.json({ success: true, insertedProject });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to insert project" },
      { status: 500 }
    );
  }
};
