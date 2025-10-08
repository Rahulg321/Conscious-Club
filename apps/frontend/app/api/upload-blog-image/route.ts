import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!userSession.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const image = formData.get("image");

  if (!image || !(image instanceof File)) {
    return NextResponse.json(
      { error: "Image file is required" },
      { status: 400 }
    );
  }

  try {
    const url = await uploadFile(image);

    if (!url) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error uploading blog image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
};
