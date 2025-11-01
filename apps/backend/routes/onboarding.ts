import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { user, project } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { onboardingSchema } from "@/lib/schemas/onboarding-schema";
import authenticateToken from "@/middleware/authenticate-token";
import { onboardingRateLimit } from "@/middleware/rate-limit-onboarding";
import { eq } from "drizzle-orm";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 5, // Max 5 files (1 profile picture + 4 project media)
  },
});

const router = Router();

router.post(
  "/",
  authenticateToken,
  onboardingRateLimit,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "projectMedia", maxCount: 4 },
  ]),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    console.log("🚀 [ONBOARDING] Starting onboarding request");

    try {
      // Get user from authenticated token
      const userFromToken = (req as any).user;
      console.log("🔐 [ONBOARDING] User authentication:", {
        userId: userFromToken?.id,
        userEmail: userFromToken?.email,
        isAuthenticated: !!userFromToken,
      });

      if (!userFromToken || !userFromToken.id) {
        console.error("❌ [ONBOARDING] User not authenticated");
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      // Extract form data
      const {
        name,
        gender,
        location,
        socialMediaUrl,
        dateOfBirth,
        userRole,
        discipline,
        role,
        projectName,
        projectDescription,
        projectLink,
        dedicatedToPerson,
        dedicatedToBrand,
        dedicatedToCause,
        dedicationReason,
      } = req.body;

      console.log("📝 [ONBOARDING] Form data received:", {
        name,
        gender,
        location,
        socialMediaUrl,
        dateOfBirth,
        userRole,
        discipline,
        role,
        projectName: projectName ? projectName.substring(0, 50) + "..." : null,
        projectDescription: projectDescription
          ? projectDescription.substring(0, 100) + "..."
          : null,
        projectLink,
        dedicatedToPerson,
        dedicatedToBrand,
        dedicatedToCause,
        dedicationReason: dedicationReason
          ? dedicationReason.substring(0, 100) + "..."
          : null,
      });

      // Get uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const profilePictureFile = files?.profilePicture?.[0];
      const projectMediaFiles = files?.projectMedia || [];

      console.log("📁 [ONBOARDING] Files received:", {
        profilePicture: profilePictureFile
          ? {
              originalname: profilePictureFile.originalname,
              mimetype: profilePictureFile.mimetype,
              size: profilePictureFile.size,
            }
          : null,
        projectMediaCount: projectMediaFiles.length,
        projectMedia: projectMediaFiles.map((file) => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        })),
      });

      // Prepare data for validation
      const validationData = {
        name,
        gender,
        location,
        socialMediaUrl: socialMediaUrl || undefined,
        dateOfBirth,
        userRole,
        discipline,
        role,
        profilePicture: profilePictureFile ? [profilePictureFile] : undefined,
        projectName: projectName || undefined,
        projectDescription: projectDescription || undefined,
        projectLink: projectLink || undefined,
        projectMedia:
          projectMediaFiles.length > 0 ? projectMediaFiles : undefined,
        dedicatedToPerson: dedicatedToPerson || undefined,
        dedicatedToBrand: dedicatedToBrand || undefined,
        dedicatedToCause: dedicatedToCause || undefined,
        dedicationReason: dedicationReason || undefined,
      };

      // Validate the data
      console.log("✅ [ONBOARDING] Starting data validation");
      const validatedData = onboardingSchema.safeParse(validationData);

      if (!validatedData.success) {
        console.error("❌ [ONBOARDING] Validation failed:", {
          issues: validatedData.error.issues,
          message: validatedData.error.message,
        });

        // Create more specific error messages for common validation issues
        const validationErrors = validatedData.error.issues.map((issue) => {
          const field = issue.path.join(".");
          switch (field) {
            case "name":
              return "Name is required and must be at least 2 characters";
            case "gender":
              return "Please select your gender";
            case "location":
              return "Location is required and must be at least 2 characters";
            case "dateOfBirth":
              return "Date of birth is required and you must be at least 13 years old";
            case "discipline":
              return "Discipline is required for creators";
            case "role":
              return "Role is required for creators";
            case "profilePicture":
              return "Profile picture must be a valid image file (JPEG, PNG, WebP)";
            case "projectName":
              return "Project name must be at least 3 characters";
            case "projectDescription":
              return "Project description must be at least 10 characters";
            case "projectMedia":
              return "Project media files must be valid images or videos";
            default:
              return issue.message;
          }
        });

        return res.status(400).json({
          error: "Invalid onboarding data",
          details: validationErrors.join(". "),
          code: "VALIDATION_ERROR",
          fieldErrors: validatedData.error.issues,
        });
      }

      console.log("✅ [ONBOARDING] Data validation successful");

      // Handle profile picture upload
      let profilePictureUrl = null;
      if (
        validatedData.data.profilePicture &&
        validatedData.data.profilePicture.length > 0
      ) {
        console.log("☁️ [ONBOARDING] Uploading profile picture");
        try {
          const profileFile = validatedData.data.profilePicture[0];
          if (!profileFile) {
            throw new Error("Profile picture file not found");
          }
          profilePictureUrl = await uploadFile(
            profileFile.buffer,
            profileFile.originalname
          );

          if (!profilePictureUrl) {
            console.error("❌ [ONBOARDING] Profile picture upload failed");
            return res.status(500).json({
              error: "Failed to upload profile picture",
              code: "PROFILE_PICTURE_UPLOAD_FAILED",
            });
          }

          console.log(
            "✅ [ONBOARDING] Profile picture uploaded successfully:",
            profilePictureUrl
          );
        } catch (error) {
          console.error("❌ [ONBOARDING] Error uploading profile picture:", {
            error: error instanceof Error ? error.message : String(error),
          });
          return res.status(500).json({
            error: "Failed to upload profile picture",
            details: error instanceof Error ? error.message : "Unknown error",
            code: "PROFILE_PICTURE_UPLOAD_ERROR",
          });
        }
      }

      // Update user in database
      console.log("💾 [ONBOARDING] Starting user update");
      try {
        const userUpdateData: any = {
          name: validatedData.data.name,
          gender: validatedData.data.gender,
          location: validatedData.data.location,
          socialUrl: validatedData.data.socialMediaUrl || null,
          dateOfBirth: new Date(validatedData.data.dateOfBirth),
          type: validatedData.data.userRole,
          discipline: validatedData.data.discipline,
          role: validatedData.data.role,
          onboardingCompleted: true,
          updatedAt: new Date(),
        };

        // Add profile picture URL if uploaded
        if (profilePictureUrl) {
          userUpdateData.image = profilePictureUrl;
        }

        console.log("💾 [ONBOARDING] User update data:", {
          ...userUpdateData,
          image: profilePictureUrl ? "uploaded" : "none",
        });

        await db
          .update(user)
          .set(userUpdateData)
          .where(eq(user.id, userFromToken.id));

        console.log("✅ [ONBOARDING] User updated successfully");
      } catch (error) {
        console.error("❌ [ONBOARDING] Database user update error:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        return res.status(500).json({
          error: "Failed to update user profile",
          details:
            error instanceof Error ? error.message : "Unknown database error",
          code: "USER_UPDATE_ERROR",
        });
      }

      // Handle project creation if project data is provided
      let insertedProject = null;
      if (
        validatedData.data.projectName &&
        validatedData.data.projectDescription
      ) {
        console.log("💾 [ONBOARDING] Starting project creation");

        // Upload project media files
        let projectMediaUrls: string[] = [];
        if (
          validatedData.data.projectMedia &&
          validatedData.data.projectMedia.length > 0
        ) {
          console.log("☁️ [ONBOARDING] Uploading project media files");
          try {
            const uploadPromises = validatedData.data.projectMedia.map(
              (file, index) => {
                console.log(
                  `📤 [ONBOARDING] Uploading project media ${index + 1}/${validatedData.data.projectMedia?.length || 0}:`,
                  {
                    filename: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                  }
                );
                return uploadFile(file.buffer, file.originalname);
              }
            );

            const urls = await Promise.all(uploadPromises);
            projectMediaUrls = urls.filter(
              (url): url is string => url !== null
            );

            if (projectMediaUrls.length !== urls.length) {
              console.warn(
                "⚠️ [ONBOARDING] Some project media files failed to upload:",
                {
                  successful: projectMediaUrls.length,
                  failed: urls.length - projectMediaUrls.length,
                }
              );
            }

            console.log(
              "✅ [ONBOARDING] Project media uploaded successfully:",
              {
                uploadedUrls: projectMediaUrls,
              }
            );
          } catch (error) {
            console.error("❌ [ONBOARDING] Error uploading project media:", {
              error: error instanceof Error ? error.message : String(error),
            });
            return res.status(500).json({
              error: "Failed to upload project media",
              details: error instanceof Error ? error.message : "Unknown error",
              code: "PROJECT_MEDIA_UPLOAD_ERROR",
            });
          }
        }

        // Create project if media was uploaded successfully
        if (projectMediaUrls.length > 0) {
          try {
            const projectData = {
              name: validatedData.data.projectName,
              description: validatedData.data.projectDescription,
              media: projectMediaUrls,
              tag: validatedData.data.role || null,
              link: validatedData.data.projectLink || null,
              dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
              dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
              dedicatedToCause: validatedData.data.dedicatedToCause || null,
              dedicationReason: validatedData.data.dedicationReason || null,
              userId: userFromToken.id,
            };

            console.log("💾 [ONBOARDING] Project data for insertion:", {
              ...projectData,
              media: projectMediaUrls.length + " files",
            });

            const [newProject] = await db
              .insert(project)
              .values(projectData)
              .returning();

            if (newProject) {
              insertedProject = newProject;
              console.log("✅ [ONBOARDING] Project created successfully:", {
                projectId: newProject.id,
              });
            }
          } catch (error) {
            console.error("❌ [ONBOARDING] Database project creation error:", {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });
            return res.status(500).json({
              error: "Failed to create project",
              details:
                error instanceof Error
                  ? error.message
                  : "Unknown database error",
              code: "PROJECT_CREATION_ERROR",
            });
          }
        }
      }

      const processingTime = Date.now() - startTime;
      console.log("✅ [ONBOARDING] Onboarding completed successfully:", {
        userId: userFromToken.id,
        processingTime: `${processingTime}ms`,
        projectCreated: !!insertedProject,
        projectId: insertedProject?.id,
      });

      res.json({
        success: true,
        message: "Onboarding completed successfully",
        userId: userFromToken.id,
        userRole: validatedData.data.userRole,
        project: insertedProject,
        processingTime,
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("❌ [ONBOARDING] Unexpected error:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        processingTime: `${processingTime}ms`,
      });
      res.status(500).json({
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

export default router;
