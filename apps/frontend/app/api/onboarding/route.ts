import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // Log all form data entries
    console.log("=== ONBOARDING FORM SUBMISSION ===");
    console.log("User ID:", userSession.user.id);
    console.log("User Email:", userSession.user.email);
    console.log("Timestamp:", new Date().toISOString());
    console.log("--- Form Data Entries ---");

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log("--- End Form Data ---");
    console.log("=== END ONBOARDING FORM SUBMISSION ===");

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Onboarding data received and logged successfully",
      userId: userSession.user.id,
    });
  } catch (error) {
    console.error("Error processing onboarding form:", error);
    return NextResponse.json(
      { error: "Failed to process onboarding data" },
      { status: 500 }
    );
  }
};
