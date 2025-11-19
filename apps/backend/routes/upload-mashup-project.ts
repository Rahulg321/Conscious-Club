import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { project, user as userTable } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { mashupProjectUploadSchema } from "@/lib/schemas/mashup-project-upload-schema";
import { sanitizeProjectData } from "@/lib/sanitize";
import authenticateToken from "@/middleware/authenticate-token";
import { uploadProjectRateLimit } from "@/middleware/rate-limit-upload";
import { eq } from "drizzle-orm";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 2, // Max 2 files (1 media + 1 cover image)
  },
});

const router = Router();

// Dedicated mashup upload endpoint (requires collaboratorId)
router.post(
  "/",
  authenticateToken,
  uploadProjectRateLimit,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    console.log("🚀 [UPLOAD-MASHUP] Starting mashup project upload request");

    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      // Extract and sanitize form data
      const sanitizedData = sanitizeProjectData(req.body);
      const {
        projectName,
        projectDescription,
        projectLink,
        dedicatedToPerson,
        dedicatedToBrand,
        dedicatedToCause,
        dedicationReason,
      } = sanitizedData;

      const collaboratorId = req.body.collaboratorId;

      if (!collaboratorId) {
        return res.status(400).json({
          error: "Collaborator ID is required for mashup projects",
          code: "MASHUP_MISSING_COLLABORATOR",
        });
      }
      if (collaboratorId === user.id) {
        return res.status(400).json({
          error: "Cannot create a mashup project with yourself",
          code: "MASHUP_SELF_COLLABORATION",
        });
      }

      // Verify collaborator exists
      try {
        const collaborator = await db
          .select({ id: userTable.id })
          .from(userTable)
          .where(eq(userTable.id, String(collaboratorId)))
          .limit(1);
        if (!collaborator || collaborator.length === 0) {
          return res.status(404).json({
            error: "Collaborator not found",
            code: "COLLABORATOR_NOT_FOUND",
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: "Failed to verify collaborator",
          code: "COLLABORATOR_VERIFICATION_ERROR",
        });
      }

      const files = req.files as {
        coverImage?: Express.Multer.File[];
        media?: Express.Multer.File[];
      };
      const coverImageFile = files?.coverImage?.[0];
      const mediaFiles = files?.media || [];

      if (!coverImageFile) {
        return res.status(400).json({
          error: "Cover image is required",
          code: "NO_COVER_IMAGE",
        });
      }
      if (!mediaFiles || mediaFiles.length === 0) {
        return res.status(400).json({
          error: "At least one media file is required",
          code: "NO_MEDIA_FILES",
        });
      }

      // Validate the data (including collaboratorId)
      const validatedData = mashupProjectUploadSchema.safeParse({
        coverImage: coverImageFile,
        media: mediaFiles,
        projectName,
        projectDescription: projectDescription?.trim() || undefined,
        projectLink,
        dedicatedToPerson: dedicatedToPerson || undefined,
        dedicatedToBrand: dedicatedToBrand || undefined,
        dedicatedToCause: dedicatedToCause || undefined,
        dedicationReason: dedicationReason || undefined,
        collaboratorId,
      });
      if (!validatedData.success) {
        return res.status(400).json({
          error: "Invalid project data",
          details: validatedData.error.message,
          code: "VALIDATION_ERROR",
        });
      }

      // Upload cover image
      let coverImageUrl: string | null = null;
      try {
        coverImageUrl = await uploadFile(
          validatedData.data.coverImage.buffer,
          validatedData.data.coverImage.originalname
        );
        if (!coverImageUrl) {
          return res.status(500).json({
            error: "Failed to upload cover image to cloud storage",
            code: "COVER_IMAGE_UPLOAD_FAILED",
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: "Failed to upload cover image to cloud storage",
          details: error instanceof Error ? error.message : "Unknown error",
          code: "COVER_IMAGE_UPLOAD_ERROR",
        });
      }

      // Upload media files
      let mediaUrls: string[] = [];
      try {
        const urls = await Promise.all(
          validatedData.data.media.map((file) =>
            uploadFile(file.buffer, file.originalname)
          )
        );
        mediaUrls = urls.filter((url): url is string => url !== null);
        if (mediaUrls.length === 0) {
          return res.status(500).json({
            error: "Failed to upload media files to cloud storage",
            code: "MEDIA_UPLOAD_FAILED",
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: "Failed to upload media files to cloud storage",
          details: error instanceof Error ? error.message : "Unknown error",
          code: "MEDIA_UPLOAD_ERROR",
        });
      }

      // Insert project
      try {
        let creatorRole: string | null = null;
        try {
          const roleRows = await db
            .select({ role: userTable.role })
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);
          creatorRole = roleRows[0]?.role ?? null;
        } catch {}

        const projectData = {
          name: validatedData.data.projectName,
          link: validatedData.data.projectLink || null,
          description: validatedData.data.projectDescription?.trim() || null,
          coverImage: coverImageUrl,
          media: mediaUrls,
          tag: creatorRole,
          dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
          dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
          dedicatedToCause: validatedData.data.dedicatedToCause || null,
          dedicationReason: validatedData.data.dedicationReason || null,
          userId: user.id,
          isMashup: true,
          collaboratorId: String(collaboratorId),
        };

        const [insertedProject] = await db
          .insert(project)
          .values(projectData)
          .returning();

        if (!insertedProject) {
          return res.status(500).json({
            error: "Failed to save project to database",
            code: "DATABASE_INSERT_FAILED",
          });
        }

        const processingTime = Date.now() - startTime;
        res.json({ success: true, insertedProject, processingTime });
      } catch (error) {
        res.status(500).json({
          error: "Failed to save project to database",
          details:
            error instanceof Error ? error.message : "Unknown database error",
          code: "DATABASE_ERROR",
        });
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      res.status(500).json({
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        code: "INTERNAL_ERROR",
        processingTime,
      });
    }
  }
);

export default router;
