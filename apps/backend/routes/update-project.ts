import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { project } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { projectUploadSchema } from "@/lib/schemas/project-upload-schema";
import { sanitizeProjectData } from "@/lib/sanitize";
import authenticateToken from "@/middleware/authenticate-token";
import { updateProjectRateLimit } from "@/middleware/rate-limit-update-project";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
    files: 5, // Max 5 files (4 media + 1 cover image)
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

const coverImageFileSchema = z
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
    return imageTypes.includes(file.mimetype);
  }, "Cover image must be JPEG, JPG, PNG, or WebP")
  .refine(
    (file) => file.size <= 20 * 1024 * 1024,
    "Cover image size must be less than 20MB"
  );

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
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 4 },
  ]),
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

      const files = req.files as {
        coverImage?: Express.Multer.File[];
        media?: Express.Multer.File[];
      };

      const coverImageFile = files?.coverImage?.[0];
      const mediaFiles = files?.media || [];

      console.log("Received update request:", {
        projectId,
        coverImage: coverImageFile
          ? {
              originalname: coverImageFile.originalname,
              size: coverImageFile.size,
              mimetype: coverImageFile.mimetype,
            }
          : null,
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

      // Validate the data - coverImage is optional for updates
      const editValidationSchema = projectUploadSchema.extend({
        coverImage: coverImageFileSchema.optional(),
        media: z
          .array(mediaFileSchema)
          .max(4, "You can upload up to 4 media files"),
      });

      const validatedData = editValidationSchema.safeParse({
        coverImage: coverImageFile || undefined,
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

      // Handle cover image upload if provided
      let coverImageUrl: string | undefined = undefined;
      if (validatedData.data.coverImage) {
        try {
          console.log(
            "Uploading cover image:",
            validatedData.data.coverImage.originalname
          );
          const uploadedUrl = await uploadFile(
            validatedData.data.coverImage.buffer,
            validatedData.data.coverImage.originalname
          );
          if (uploadedUrl) {
            coverImageUrl = uploadedUrl;
            console.log("Cover image uploaded successfully:", coverImageUrl);
          } else {
            console.error("Failed to upload cover image");
            return res.status(500).json({
              error: "Failed to upload cover image to cloud storage",
              code: "COVER_IMAGE_UPLOAD_FAILED",
            });
          }
        } catch (error) {
          console.error("Error uploading cover image:", error);
          return res.status(500).json({
            error: "Failed to upload cover image to cloud storage",
            code: "COVER_IMAGE_UPLOAD_ERROR",
          });
        }
      }

      // Handle media files - upload all files
      let mediaUrls: string[] | undefined = undefined;

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
          const uploadedUrls = urls.filter((url): url is string => url !== null);

          if (uploadedUrls.length === 0) {
            return res.status(500).json({
              error: "Failed to upload media files to cloud storage",
              code: "MEDIA_UPLOAD_FAILED",
            });
          }

          mediaUrls = uploadedUrls;

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

      // Update project in database
      const projectData: {
        name: string;
        link: string | null;
        description: string;
        coverImage?: string;
        media?: string[];
        dedicatedToPerson: string | null;
        dedicatedToBrand: string | null;
        dedicatedToCause: string | null;
        dedicationReason: string | null;
        updatedAt: Date;
      } = {
        name: validatedData.data.projectName,
        link: validatedData.data.projectLink || null,
        description: validatedData.data.projectDescription,
        dedicatedToPerson: validatedData.data.dedicatedToPerson || null,
        dedicatedToBrand: validatedData.data.dedicatedToBrand || null,
        dedicatedToCause: validatedData.data.dedicatedToCause || null,
        dedicationReason: validatedData.data.dedicationReason || null,
        updatedAt: new Date(),
      };

      // Only update coverImage if a new one was provided
      if (coverImageUrl) {
        projectData.coverImage = coverImageUrl;
      }

      // Only update media if new files were uploaded
      if (mediaUrls) {
        projectData.media = mediaUrls;
      }

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
