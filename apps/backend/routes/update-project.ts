import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { projectUploadSchema } from "@/lib/schemas/project-upload-schema";
import authenticateToken from "@/middleware/authenticate-token";
import { updateProjectRateLimit } from "@/middleware/rate-limit-update-project";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 4, // Max 4 files
  },
});

const mediaFileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number(),
  })
  .refine((file) => {
    const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    return [...imageTypes, ...videoTypes].includes(file.mimetype);
  }, "Only images (JPEG, JPG, PNG, WebP) or videos (MP4, WebM, MOV) are allowed")
  .refine((file) => {
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (videoTypes.includes(file.mimetype)) {
      return file.size <= 200 * 1024 * 1024; // 200MB for videos
    }
    return file.size <= 20 * 1024 * 1024; // 20MB for images
  }, "File size exceeds the maximum allowed size (20MB for images, 200MB for videos)");

const router = Router();

router.get(
  "/:projectId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        error: "Project ID is required",
        code: "MISSING_PROJECT_ID",
      });
    }

    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      const foundProject = await db
        .select()
        .from(project)
        .where(and(eq(project.id, projectId), eq(project.userId, user.id)))
        .limit(1);

      if (foundProject.length === 0) {
        return res.status(404).json({
          error: "Project not found or you don't have permission to view it",
          code: "PROJECT_NOT_FOUND",
        });
      }

      res.json({
        success: true,
        project: foundProject[0],
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

router.put(
  "/:projectId",
  authenticateToken,
  updateProjectRateLimit,
  upload.array("media", 4),
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        error: "Project ID is required",
        code: "MISSING_PROJECT_ID",
      });
    }

    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      // Check if project exists and belongs to user
      const existingProject = await db
        .select()
        .from(project)
        .where(and(eq(project.id, projectId), eq(project.userId, user.id)))
        .limit(1);

      if (existingProject.length === 0) {
        return res.status(404).json({
          error: "Project not found or you don't have permission to edit it",
          code: "PROJECT_NOT_FOUND",
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
      } = req.body;

      const mediaFiles = req.files as Express.Multer.File[];

      console.log("Received update request:", {
        projectId,
        mediaFilesCount: mediaFiles?.length || 0,
        mediaFiles:
          mediaFiles?.map((f) => ({
            originalname: f.originalname,
            size: f.size,
            mimetype: f.mimetype,
          })) || [],
        body: {
          projectName,
          projectDescription: projectDescription?.substring(0, 50) + "...",
          projectLink,
        },
      });

      // Validate the data
      const editValidationSchema = projectUploadSchema.extend({
        media: z
          .array(mediaFileSchema)
          .max(4, "You can upload up to 4 media files"),
      });

      const validatedData = editValidationSchema.safeParse({
        media: mediaFiles || [],
        projectName,
        projectDescription,
        projectLink,
        dedicatedToPerson: dedicatedToPerson || undefined,
        dedicatedToBrand: dedicatedToBrand || undefined,
        dedicatedToCause: dedicatedToCause || undefined,
        dedicationReason: dedicationReason || undefined,
      });

      if (!validatedData.success) {
        return res.status(400).json({
          error: "Invalid project data",
          details: validatedData.error.message,
          code: "VALIDATION_ERROR",
        });
      }

      // Check total media count
      const totalMediaCount = validatedData.data.media?.length || 0;
      if (totalMediaCount > 4) {
        return res.status(400).json({
          error: "You can only have up to 4 media files",
          code: "MEDIA_LIMIT_EXCEEDED",
        });
      }

      // Handle media files - upload all files
      let mediaUrls: string[] = [];

      if (validatedData.data.media && validatedData.data.media.length > 0) {
        try {
          console.log(
            `Uploading ${validatedData.data.media.length} media files`
          );

          const uploadPromises = validatedData.data.media.map((file) => {
            console.log(
              `Uploading file: ${file.originalname} (${file.size} bytes)`
            );
            return uploadFile(file.buffer, file.originalname);
          });

          const urls = await Promise.all(uploadPromises);
          mediaUrls = urls.filter((url): url is string => url !== null);

          console.log(
            `Successfully uploaded ${mediaUrls.length} files:`,
            mediaUrls
          );
        } catch (error) {
          console.error("Error uploading media files:", error);
          return res.status(500).json({
            error: "Failed to upload media files to cloud storage",
            code: "MEDIA_UPLOAD_ERROR",
          });
        }
      }

      // Validate that we have at least one media file
      if (mediaUrls.length === 0) {
        return res.status(400).json({
          error: "At least one media file is required",
          code: "NO_MEDIA_FILES",
        });
      }

      // Update project in database
      const projectData = {
        name: validatedData.data.projectName,
        link: validatedData.data.projectLink || null,
        description: validatedData.data.projectDescription,
        media: mediaUrls,
        dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
        dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
        dedicatedToCause: validatedData.data.dedicatedToCause || null,
        dedicationReason: validatedData.data.dedicationReason || null,
        updatedAt: new Date(),
      };

      const [updatedProject] = await db
        .update(project)
        .set(projectData)
        .where(and(eq(project.id, projectId), eq(project.userId, user.id)))
        .returning();

      if (!updatedProject) {
        return res.status(500).json({
          error: "Failed to update project in database",
          code: "DATABASE_UPDATE_FAILED",
        });
      }

      res.json({
        success: true,
        updatedProject,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }
);

export default router;
