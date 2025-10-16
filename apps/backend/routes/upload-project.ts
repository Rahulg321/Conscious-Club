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
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 4, // Max 4 files
  },
});

const router = Router();

router.post(
  "/",
  authenticateToken,
  upload.array("media", 4),
  async (req: Request, res: Response) => {
    try {
      console.log("inside post request");

      // Get user from authenticated token
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ error: "User not authenticated" });
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

      const mediaFiles = req.files as Express.Multer.File[];

      if (!mediaFiles || mediaFiles.length === 0) {
        return res.status(400).json({
          error: "At least one media file is required",
        });
      }

      // Validate the data
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
        console.log("Validation failed:", validatedData.error.message);
        return res.status(400).json({
          error: validatedData.error.message,
        });
      }

      console.log("Data validated successfully");

      // Upload all media files
      let mediaUrls: string[] = [];
      if (validatedData.data.media && validatedData.data.media.length > 0) {
        try {
          const uploadPromises = validatedData.data.media.map((file) =>
            uploadFile(file.buffer, file.originalname)
          );
          const urls = await Promise.all(uploadPromises);

          // Filter out any failed uploads (null values)
          mediaUrls = urls.filter((url): url is string => url !== null);

          if (mediaUrls.length !== urls.length) {
            console.warn("Some media files failed to upload");
          }

          if (mediaUrls.length === 0) {
            return res.status(500).json({
              error: "Failed to upload media files",
            });
          }
        } catch (error) {
          console.error("Error uploading media files:", error);
          return res.status(500).json({
            error: "Failed to upload media files",
          });
        }
      }

      // Insert project into database
      try {
        const [insertedProject] = await db
          .insert(project)
          .values({
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
          })
          .returning();

        if (!insertedProject) {
          console.error("Project was not inserted");
          return res.status(500).json({
            error: "Failed to insert project",
          });
        }

        console.log("Project uploaded successfully:", insertedProject);

        res.json({
          success: true,
          insertedProject,
        });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
          error: "Failed to insert project",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

export default router;
