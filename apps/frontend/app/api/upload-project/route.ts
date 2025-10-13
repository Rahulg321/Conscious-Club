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

  const media = formData.getAll("media");
  const projectName = formData.get("projectName");
  const projectDescription = formData.get("projectDescription");
  const projectLink = formData.get("projectLink");
  const dedicatedToPerson = formData.get("dedicatedToPerson");
  const dedicatedToBrand = formData.get("dedicatedToBrand");
  const dedicatedToCause = formData.get("dedicatedToCause");
  const dedicationReason = formData.get("dedicationReason");
  const isMashup = formData.get("isMashup");
  const collaboratorId = formData.get("collaboratorId");

  if (!media || media.length === 0)
    return NextResponse.json(
      { error: "At least one media file is required" },
      { status: 400 }
    );

  const validatedData = projectUploadSchema.safeParse({
    media,
    projectName,
    projectDescription,
    projectLink,
    dedicatedToPerson: dedicatedToPerson || undefined,
    dedicatedToBrand: dedicatedToBrand || undefined,
    dedicatedToCause: dedicatedToCause || undefined,
    dedicationReason: dedicationReason || undefined,
  });

  if (!validatedData.success) {
    console.log("invalid format");

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  console.log("validatedData", validatedData);

  // Upload all media files
  let mediaUrls: string[] = [];
  if (validatedData.data.media && validatedData.data.media.length > 0) {
    try {
      const uploadPromises = validatedData.data.media.map((file) =>
        uploadFile(file)
      );
      const urls = await Promise.all(uploadPromises);

      // Filter out any failed uploads (null values)
      mediaUrls = urls.filter((url): url is string => url !== null);

      if (mediaUrls.length !== urls.length) {
        console.warn("Some media files failed to upload");
      }

      if (mediaUrls.length === 0) {
        return NextResponse.json(
          { error: "Failed to upload media files" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error uploading media files:", error);
      return NextResponse.json(
        { error: "Failed to upload media files" },
        { status: 500 }
      );
    }
  }

  try {
    const [insertedProject] = await db
      .insert(project)
      .values({
        name: validatedData.data.projectName,
        link: validatedData.data.projectLink || null,
        description: validatedData.data.projectDescription,
        media: mediaUrls,
        dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
        dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
        dedicatedToCause: validatedData.data.dedicatedToCause || null,
        dedicationReason: validatedData.data.dedicationReason || null,
        userId: userSession.user.id,
        isMashup: isMashup === "true",
        collaboratorId: collaboratorId ? String(collaboratorId) : null,
      })
      .returning();

    if (!insertedProject) {
      console.error("project was not inserted");
      return NextResponse.json(
        { error: "Failed to insert project" },
        { status: 500 }
      );
    }

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
