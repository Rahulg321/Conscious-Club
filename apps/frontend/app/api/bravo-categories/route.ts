import { NextRequest, NextResponse } from "next/server";
import { getAllBravoCategories } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllBravoCategories();

    if (!categories) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching bravo categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
