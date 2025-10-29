import { auth } from "@/auth";
import { db } from "@repo/db";
import { user, project } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // Extract all form data
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const location = formData.get("location") as string;
    const socialMediaUrl = formData.get("socialMediaUrl") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const userRole = formData.get("userRole") as string;
    const profilePicture = formData.get("profilePicture") as File;
    const fun = formData.get("fun") as string;
    const role = formData.get("role") as string;
    const discipline = formData.get("discipline") as string;
    const projectName = formData.get("projectName") as string;
    const projectDescription = formData.get("projectDescription") as string;
    const projectMedia = formData.getAll("projectMedia") as File[];
    const projectLink = formData.get("projectLink") as string;
    const dedicatedToPerson = formData.get("dedicatedToPerson") as string;
    const dedicatedToBrand = formData.get("dedicatedToBrand") as string;
    const dedicatedToCause = formData.get("dedicatedToCause") as string;
    const dedicationReason = formData.get("dedicationReason") as string;

    // Validate required fields based on user role
    if (!name || !gender || !location || !dateOfBirth || !userRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role-specific fields for creators
    if (!discipline || !role) {
      return NextResponse.json(
        {
          error: "Discipline and role are required for creators",
        },
        { status: 400 }
      );
    }

    // Handle profile picture upload if provided
    let profilePictureUrl = null;

    if (profilePicture && profilePicture.size > 0) {
      try {
        profilePictureUrl = await uploadFile(profilePicture);
        if (!profilePictureUrl) {
          return NextResponse.json(
            { error: "Failed to upload profile picture" },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        return NextResponse.json(
          { error: "Failed to upload profile picture" },
          { status: 500 }
        );
      }
    }

    // Prepare user data for update
    const userUpdateData: any = {
      name,
      gender: gender as "male" | "female" | "prefer_not_to_say",
      location,
      socialUrl: socialMediaUrl || null,
      dateOfBirth: new Date(dateOfBirth),
      type: userRole as "creator",
      updatedAt: new Date(),
    };

    // Add role-specific fields for creators
    userUpdateData.discipline = discipline;
    userUpdateData.role = role;
    userUpdateData.fun = null;

    // Add profile picture URL if uploaded
    if (profilePictureUrl) {
      userUpdateData.image = profilePictureUrl;
    }

    // Update user in database
    await db
      .update(user)
      .set({
        ...userUpdateData,
        onboardingCompleted: true,
      })
      .where(eq(user.id, userSession.user.id));

    console.log(
      "✅ Database updated - onboardingCompleted set to true for user:",
      userSession.user.id
    );

    // Handle project creation for creators (optional)
    if (projectName && projectDescription) {
      const projectMediaUrls: string[] = [];

      // Handle project media upload if provided
      if (projectMedia && projectMedia.length > 0) {
        try {
          // Upload all media files
          for (const mediaFile of projectMedia) {
            if (mediaFile && mediaFile.size > 0) {
              const mediaUrl = await uploadFile(mediaFile);
              if (!mediaUrl) {
                return NextResponse.json(
                  { error: "Failed to upload project media" },
                  { status: 500 }
                );
              }
              projectMediaUrls.push(mediaUrl);
            }
          }
        } catch (error) {
          console.error("Error uploading project media:", error);
          return NextResponse.json(
            { error: "Failed to upload project media" },
            { status: 500 }
          );
        }
      }

      // Create project if all required fields are present
      if (projectMediaUrls.length > 0) {
        await db.insert(project).values({
          name: projectName,
          description: projectDescription,
          media: projectMediaUrls,
          tag: role || null,
          link: projectLink || null,
          dedicatedToPerson: dedicatedToPerson || null,
          dedicatedToBrand: dedicatedToBrand || null,
          dedicatedToCause: dedicatedToCause || null,
          dedicationReason: dedicationReason || null,
          userId: userSession.user.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      userId: userSession.user.id,
      userRole,
    });
  } catch (error) {
    console.error("Error processing onboarding form:", error);
    return NextResponse.json(
      { error: "Failed to process onboarding data" },
      { status: 500 }
    );
  }
};
