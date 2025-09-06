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
    const projectCoverImage = formData.get("projectCoverImage") as File;
    const projectLink = formData.get("projectLink") as string;

    // Validate required fields based on user role
    if (!name || !gender || !location || !dateOfBirth || !userRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role-specific fields
    if (userRole !== "explorer") {
      if (!discipline || !role) {
        return NextResponse.json(
          {
            error:
              "Discipline and role are required for creators and organizers",
          },
          { status: 400 }
        );
      }
    } else {
      if (!fun) {
        return NextResponse.json(
          { error: "Interests are required for explorers" },
          { status: 400 }
        );
      }
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
      type: userRole as "explorer" | "creator" | "organizer",
      updatedAt: new Date(),
    };

    // Add role-specific fields
    if (userRole === "explorer") {
      userUpdateData.fun = fun;
      // Clear discipline and role for explorers
      userUpdateData.discipline = null;
      userUpdateData.role = null;
    } else {
      userUpdateData.discipline = discipline;
      userUpdateData.role = role;
      // Clear fun for non-explorers
      userUpdateData.fun = null;
    }

    // Add profile picture URL if uploaded
    if (profilePictureUrl) {
      userUpdateData.image = profilePictureUrl;
    }

    // Update user in database
    await db
      .update(user)
      .set(userUpdateData)
      .where(eq(user.id, userSession.user.id));

    // Handle project creation for creators and organizers (optional)
    if (userRole !== "explorer" && projectName && projectDescription) {
      let projectCoverImageUrl = null;

      // Handle project cover image upload if provided
      if (projectCoverImage && projectCoverImage.size > 0) {
        try {
          projectCoverImageUrl = await uploadFile(projectCoverImage);
          if (!projectCoverImageUrl) {
            return NextResponse.json(
              { error: "Failed to upload project cover image" },
              { status: 500 }
            );
          }
        } catch (error) {
          console.error("Error uploading project cover image:", error);
          return NextResponse.json(
            { error: "Failed to upload project cover image" },
            { status: 500 }
          );
        }
      }

      // Create project if all required fields are present
      if (projectCoverImageUrl && projectLink) {
        await db.insert(project).values({
          name: projectName,
          description: projectDescription,
          coverImage: projectCoverImageUrl,
          link: projectLink,
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
