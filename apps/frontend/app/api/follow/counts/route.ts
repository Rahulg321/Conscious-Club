import { NextRequest, NextResponse } from "next/server";
import { getUserFollowCounts } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const { followers, following } = await getUserFollowCounts(userId);

    return NextResponse.json({ followers, following });
  } catch (error) {
    console.error("Error fetching follow counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow counts" },
      { status: 500 }
    );
  }
}
