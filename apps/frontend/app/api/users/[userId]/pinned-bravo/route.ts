import { NextRequest, NextResponse } from "next/server";
import { getUserPinnedBravoImage } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const pinnedBravo = await getUserPinnedBravoImage(userId);

    return NextResponse.json({ pinnedBravo });
  } catch (error) {
    console.error("Error fetching pinned bravo:", error);
    return NextResponse.json(
      { error: "Failed to fetch pinned bravo" },
      { status: 500 }
    );
  }
}



