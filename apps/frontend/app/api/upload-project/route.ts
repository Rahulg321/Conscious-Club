import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { projectUploadSchema } from "@/lib/schemas/project-upload-schema";
import { db } from "@repo/db";
import { project, projectTags } from "@repo/db/schema";
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
  const tagId = formData.get("tagId") as string;
  const projectLink = formData.get("projectLink");
  const additionalImages = formData.getAll("additionalImages");

  if (!projectCover)
    return NextResponse.json({ error: "File is required" }, { status: 400 });

  const validatedData = projectUploadSchema.safeParse({
    projectCover,
    projectName,
    projectDescription,
    projectLink,
    tagId: tagId as string,
    additionalImages:
      additionalImages.length > 0 ? additionalImages : undefined,
  });

  if (!validatedData.success) {
    console.log("invalid format");

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  console.log("invalidatedData", validatedData);

  // Upload cover image
  const url = await uploadFile(projectCover as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );

  console.log("the url is also working", url);

  // Upload additional images if any
  let additionalImageUrls: string[] = [];
  if (
    validatedData.data.additionalImages &&
    validatedData.data.additionalImages.length > 0
  ) {
    try {
      const uploadPromises = validatedData.data.additionalImages.map((file) =>
        uploadFile(file)
      );
      const urls = await Promise.all(uploadPromises);

      // Filter out any failed uploads (null values)
      additionalImageUrls = urls.filter((url): url is string => url !== null);

      if (additionalImageUrls.length !== urls.length) {
        console.warn("Some additional images failed to upload");
      }
    } catch (error) {
      console.error("Error uploading additional images:", error);
      // Continue with project creation even if additional images fail
    }
  }

  try {
    const [insertedProject] = await db
      .insert(project)
      .values({
        name: validatedData.data.projectName,
        link: validatedData.data.projectLink || null,
        description: validatedData.data.projectDescription,
        coverImage: url,
        additionalImages:
          additionalImageUrls.length > 0 ? additionalImageUrls : null,
        userId: userSession.user.id,
      })
      .returning();

    if (!insertedProject) {
      console.error("project was not inserted");
      return NextResponse.json(
        { error: "Failed to insert project" },
        { status: 500 }
      );
    }

    await db.insert(projectTags).values({
      projectId: insertedProject?.id as string,
      tagId: validatedData.data.tagId,
    });

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
