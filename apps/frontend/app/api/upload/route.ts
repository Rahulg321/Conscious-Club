import { auth } from "@/auth";
import { uploadFile } from "@/lib/cloud-storage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const file = formData.get("projectCover");

  if (!file)
    return NextResponse.json({ error: "File is required" }, { status: 400 });

  const url = await uploadFile(file as File);

  if (!url)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );

  console.log("the url is also working", url);

  return NextResponse.json({ success: true });
};
