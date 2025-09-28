import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { bravoUploadSchema } from "@/lib/schemas/bravo-upload-schema";
import { db } from "@repo/db";
import { bravos } from "@repo/db/schema";
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
  const type = formData.get("type");
  const image = formData.get("image");

  if (!name || !description || !type || !image) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const validatedData = bravoUploadSchema.safeParse({
    name,
    description,
    type,
    image,
  });

  if (!validatedData.success) {
    console.log("Invalid format:", validatedData.error.message);

    return NextResponse.json(
      { error: validatedData.error.message },
      { status: 400 }
    );
  }

  const url = await uploadFile(image as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );

  console.log("Image uploaded successfully:", url);

  try {
    const [newBravo] = await db
      .insert(bravos)
      .values({
        name: validatedData.data.name,
        slug: slugify(validatedData.data.name, { lower: true }),
        description: validatedData.data.description,
        type: validatedData.data.type,
        image: url,
      })
      .returning();

    revalidatePath("/admin");
    revalidatePath("/bravos");

    return NextResponse.json({ success: true, bravo: newBravo });
  } catch (error) {
    console.error("Error creating bravo:", error);
    return NextResponse.json(
      { error: "Failed to create bravo" },
      { status: 500 }
    );
  }
};
