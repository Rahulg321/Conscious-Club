import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { projectUploadSchema } from "@/lib/schemas/project-upload-schema";
import authenticateToken from "@/middleware/authenticate-token";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 4, // Max 4 files
  },
});

const router = Router();

router.post(
  "/",
  authenticateToken,
  upload.array("media", 4),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    console.log("🚀 [UPLOAD-PROJECT] Starting project upload request");

    try {
      // Get user from authenticated token
      const user = (req as any).user;
      console.log("🔐 [UPLOAD-PROJECT] User authentication:", {
        userId: user?.id,
        userEmail: user?.email,
        isAuthenticated: !!user,
      });

      if (!user || !user.id) {
        console.error("❌ [UPLOAD-PROJECT] User not authenticated");
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      // Extract form data
      const {
        projectName,
        projectDescription,
        projectLink,
        dedicatedToPerson,
        dedicatedToBrand,
        dedicatedToCause,
        dedicationReason,
        isMashup,
        collaboratorId,
      } = req.body;

      console.log("📝 [UPLOAD-PROJECT] Form data received:", {
        projectName,
        projectDescription: projectDescription?.substring(0, 100) + "...",
        projectLink,
        dedicatedToPerson,
        dedicatedToBrand,
        dedicatedToCause,
        dedicationReason: dedicationReason?.substring(0, 100) + "...",
        isMashup,
        collaboratorId,
      });

      const mediaFiles = req.files as Express.Multer.File[];
      console.log("📁 [UPLOAD-PROJECT] Media files received:", {
        fileCount: mediaFiles?.length || 0,
        files: mediaFiles?.map((file) => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          bufferLength: file.buffer?.length,
        })),
      });

      if (!mediaFiles || mediaFiles.length === 0) {
        console.error("❌ [UPLOAD-PROJECT] No media files provided");
        return res.status(400).json({
          error: "At least one media file is required",
          code: "NO_MEDIA_FILES",
        });
      }

      // Validate the data
      console.log("✅ [UPLOAD-PROJECT] Starting data validation");
      const validatedData = projectUploadSchema.safeParse({
        media: mediaFiles,
        projectName,
        projectDescription,
        projectLink,
        dedicatedToPerson: dedicatedToPerson || undefined,
        dedicatedToBrand: dedicatedToBrand || undefined,
        dedicatedToCause: dedicatedToCause || undefined,
        dedicationReason: dedicationReason || undefined,
      });

      if (!validatedData.success) {
        console.error("❌ [UPLOAD-PROJECT] Validation failed:", {
          issues: validatedData.error.issues,
          message: validatedData.error.message,
        });
        return res.status(400).json({
          error: "Invalid project data",
          details: validatedData.error.message,
          code: "VALIDATION_ERROR",
        });
      }

      console.log("✅ [UPLOAD-PROJECT] Data validation successful");

      // Upload all media files
      let mediaUrls: string[] = [];
      if (validatedData.data.media && validatedData.data.media.length > 0) {
        console.log(
          "☁️ [UPLOAD-PROJECT] Starting media file upload to cloud storage"
        );
        try {
          const uploadPromises = validatedData.data.media.map((file, index) => {
            console.log(
              `📤 [UPLOAD-PROJECT] Uploading file ${index + 1}/${validatedData.data.media.length}:`,
              {
                filename: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
              }
            );
            return uploadFile(file.buffer, file.originalname);
          });

          const urls = await Promise.all(uploadPromises);
          console.log("📤 [UPLOAD-PROJECT] All upload promises completed:", {
            totalFiles: urls.length,
            successfulUploads: urls.filter((url) => url !== null).length,
            failedUploads: urls.filter((url) => url === null).length,
          });

          // Filter out any failed uploads (null values)
          mediaUrls = urls.filter((url): url is string => url !== null);

          if (mediaUrls.length !== urls.length) {
            console.warn(
              "⚠️ [UPLOAD-PROJECT] Some media files failed to upload:",
              {
                successful: mediaUrls.length,
                failed: urls.length - mediaUrls.length,
                failedFiles: urls
                  .map((url, index) => ({
                    index,
                    url,
                    filename: validatedData.data.media[index]?.originalname,
                  }))
                  .filter((item) => item.url === null),
              }
            );
          }

          if (mediaUrls.length === 0) {
            console.error("❌ [UPLOAD-PROJECT] All media file uploads failed");
            return res.status(500).json({
              error: "Failed to upload media files to cloud storage",
              code: "MEDIA_UPLOAD_FAILED",
            });
          }

          console.log(
            "✅ [UPLOAD-PROJECT] Media files uploaded successfully:",
            {
              uploadedUrls: mediaUrls,
            }
          );
        } catch (error) {
          console.error("❌ [UPLOAD-PROJECT] Error uploading media files:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          return res.status(500).json({
            error: "Failed to upload media files to cloud storage",
            details: error instanceof Error ? error.message : "Unknown error",
            code: "MEDIA_UPLOAD_ERROR",
          });
        }
      }

      // Insert project into database
      console.log("💾 [UPLOAD-PROJECT] Starting database insertion");
      try {
        const projectData = {
          name: validatedData.data.projectName,
          link: validatedData.data.projectLink || null,
          description: validatedData.data.projectDescription,
          media: mediaUrls,
          dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
          dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
          dedicatedToCause: validatedData.data.dedicatedToCause || null,
          dedicationReason: validatedData.data.dedicationReason || null,
          userId: user.id,
          isMashup: isMashup === "true",
          collaboratorId: collaboratorId ? String(collaboratorId) : null,
        };

        console.log("💾 [UPLOAD-PROJECT] Project data for insertion:", {
          ...projectData,
          media: mediaUrls.length + " files",
        });

        const [insertedProject] = await db
          .insert(project)
          .values(projectData)
          .returning();

        if (!insertedProject) {
          console.error(
            "❌ [UPLOAD-PROJECT] Project was not inserted into database"
          );
          return res.status(500).json({
            error: "Failed to save project to database",
            code: "DATABASE_INSERT_FAILED",
          });
        }

        const processingTime = Date.now() - startTime;
        console.log("✅ [UPLOAD-PROJECT] Project uploaded successfully:", {
          projectId: insertedProject.id,
          processingTime: `${processingTime}ms`,
          mediaCount: mediaUrls.length,
        });

        res.json({
          success: true,
          insertedProject,
          processingTime,
        });
      } catch (error) {
        console.error("❌ [UPLOAD-PROJECT] Database error:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        res.status(500).json({
          error: "Failed to save project to database",
          details:
            error instanceof Error ? error.message : "Unknown database error",
          code: "DATABASE_ERROR",
        });
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("❌ [UPLOAD-PROJECT] Unexpected error:", {
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
