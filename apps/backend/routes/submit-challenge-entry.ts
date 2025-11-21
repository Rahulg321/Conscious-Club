import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@repo/db";
import { challengeEntries, challenges } from "@repo/db/schema";
import { uploadFile } from "@/lib/cloud-storage";
import { challengeEntrySchema } from "@/lib/schemas/challenge-entry-schema";
import { sanitizeChallengeCaption } from "@/lib/sanitize";
import authenticateToken from "@/middleware/authenticate-token";
import { submitChallengeEntryRateLimit } from "@/middleware/rate-limit-submit-entry";
import { eq, and, sql } from "drizzle-orm";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size (for videos)
    files: 1, // Only 1 file allowed
  },
});

const router = Router();

router.post(
  "/",
  authenticateToken,
  submitChallengeEntryRateLimit,
  upload.single("media"),
  async (req: Request, res: Response) => {
    const startTime = Date.now();
    console.log(
      "🚀 [SUBMIT-CHALLENGE-ENTRY] Starting challenge entry submission"
    );

    try {
      // Get user from authenticated token
      const user = (req as any).user;
      console.log("🔐 [SUBMIT-CHALLENGE-ENTRY] User authentication:", {
        userId: user?.id,
        userEmail: user?.email,
        isAuthenticated: !!user,
      });

      if (!user || !user.id) {
        console.error("❌ [SUBMIT-CHALLENGE-ENTRY] User not authenticated");
        return res.status(401).json({
          error: "User not authenticated",
          code: "AUTH_ERROR",
        });
      }

      // Extract and sanitize form data
      const { challengeId } = req.body;
      const caption = sanitizeChallengeCaption(req.body.caption);

      console.log("📝 [SUBMIT-CHALLENGE-ENTRY] Form data received:", {
        challengeId,
        caption: caption?.substring(0, 100) + "...",
      });

      const mediaFile = req.file as Express.Multer.File | undefined;
      console.log("📁 [SUBMIT-CHALLENGE-ENTRY] Media file received:", {
        hasFile: !!mediaFile,
        file: mediaFile
          ? {
              originalname: mediaFile.originalname,
              mimetype: mediaFile.mimetype,
              size: mediaFile.size,
              bufferLength: mediaFile.buffer?.length,
            }
          : null,
      });

      if (!mediaFile) {
        console.error("❌ [SUBMIT-CHALLENGE-ENTRY] No media file provided");
        return res.status(400).json({
          error: "Media file is required",
          code: "NO_MEDIA_FILE",
        });
      }

      // Validate the data
      console.log("✅ [SUBMIT-CHALLENGE-ENTRY] Starting data validation");
      const validatedData = challengeEntrySchema.safeParse({
        media: mediaFile,
        challengeId,
        caption,
      });

      if (!validatedData.success) {
        console.error("❌ [SUBMIT-CHALLENGE-ENTRY] Validation failed:", {
          issues: validatedData.error.issues,
          message: validatedData.error.message,
        });
        return res.status(400).json({
          error: "Invalid entry data",
          details: validatedData.error.message,
          code: "VALIDATION_ERROR",
        });
      }

      console.log("✅ [SUBMIT-CHALLENGE-ENTRY] Data validation successful");

      // Check if challenge exists and is active
      const [challenge] = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, challengeId))
        .limit(1);

      if (!challenge) {
        console.error("❌ [SUBMIT-CHALLENGE-ENTRY] Challenge not found:", {
          challengeId,
        });
        return res.status(404).json({
          error: "Challenge not found",
          code: "CHALLENGE_NOT_FOUND",
        });
      }

      if (challenge.isCompleted) {
        console.error(
          "❌ [SUBMIT-CHALLENGE-ENTRY] Challenge is completed:",
          challengeId
        );
        return res.status(400).json({
          error: "This challenge has been completed and entries are closed",
          code: "CHALLENGE_COMPLETED",
        });
      }

      if (!challenge.isActive) {
        console.error(
          "❌ [SUBMIT-CHALLENGE-ENTRY] Challenge is not active:",
          challengeId
        );
        return res.status(400).json({
          error: "This challenge is no longer active",
          code: "CHALLENGE_INACTIVE",
        });
      }

      // Check if deadline has passed
      if (new Date() > new Date(challenge.deadline)) {
        console.error(
          "❌ [SUBMIT-CHALLENGE-ENTRY] Challenge deadline has passed:",
          challengeId
        );
        return res.status(400).json({
          error: "The deadline for this challenge has passed",
          code: "DEADLINE_PASSED",
        });
      }

      // Check if user already submitted an entry
      const [existingEntry] = await db
        .select()
        .from(challengeEntries)
        .where(
          and(
            eq(challengeEntries.challengeId, challengeId),
            eq(challengeEntries.userId, user.id)
          )
        )
        .limit(1);

      if (existingEntry) {
        console.error(
          "❌ [SUBMIT-CHALLENGE-ENTRY] User already submitted entry:",
          {
            challengeId,
            userId: user.id,
          }
        );
        return res.status(400).json({
          error: "You have already submitted an entry for this challenge",
          code: "DUPLICATE_ENTRY",
        });
      }

      // Upload media file to cloud storage
      console.log(
        "☁️ [SUBMIT-CHALLENGE-ENTRY] Starting media file upload to cloud storage"
      );
      let mediaUrl: string | null = null;
      try {
        mediaUrl = await uploadFile(mediaFile.buffer, mediaFile.originalname);
        if (!mediaUrl) {
          console.error("❌ [SUBMIT-CHALLENGE-ENTRY] Media file upload failed");
          return res.status(500).json({
            error: "Failed to upload media file to cloud storage",
            code: "MEDIA_UPLOAD_FAILED",
          });
        }

        console.log(
          "✅ [SUBMIT-CHALLENGE-ENTRY] Media file uploaded successfully:",
          {
            mediaUrl,
          }
        );
      } catch (error) {
        console.error(
          "❌ [SUBMIT-CHALLENGE-ENTRY] Error uploading media file:",
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          }
        );
        return res.status(500).json({
          error: "Failed to upload media file to cloud storage",
          details: error instanceof Error ? error.message : "Unknown error",
          code: "MEDIA_UPLOAD_ERROR",
        });
      }

      // Insert challenge entry into database
      console.log("💾 [SUBMIT-CHALLENGE-ENTRY] Starting database insertion");
      try {
        const entryData = {
          challengeId: validatedData.data.challengeId,
          userId: user.id,
          caption: validatedData.data.caption,
          media: [mediaUrl], // Store as array in database
        };

        console.log("💾 [SUBMIT-CHALLENGE-ENTRY] Entry data for insertion:", {
          ...entryData,
          media: "[1 file]",
        });

        const [insertedEntry] = await db
          .insert(challengeEntries)
          .values(entryData)
          .returning();

        if (!insertedEntry) {
          console.error(
            "❌ [SUBMIT-CHALLENGE-ENTRY] Entry was not inserted into database"
          );
          return res.status(500).json({
            error: "Failed to save entry to database",
            code: "DATABASE_INSERT_FAILED",
          });
        }

        // Update participants count atomically using SQL increment
        // This prevents race conditions from concurrent submissions
        await db
          .update(challenges)
          .set({
            participantsCount: sql`${challenges.participantsCount} + 1`,
          })
          .where(eq(challenges.id, challengeId));

        const processingTime = Date.now() - startTime;
        console.log(
          "✅ [SUBMIT-CHALLENGE-ENTRY] Entry submitted successfully:",
          {
            entryId: insertedEntry.id,
            processingTime: `${processingTime}ms`,
          }
        );

        res.json({
          success: true,
          insertedEntry,
          processingTime,
        });
      } catch (error) {
        console.error("❌ [SUBMIT-CHALLENGE-ENTRY] Database error:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        res.status(500).json({
          error: "Failed to save entry to database",
          details:
            error instanceof Error ? error.message : "Unknown database error",
          code: "DATABASE_ERROR",
        });
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("❌ [SUBMIT-CHALLENGE-ENTRY] Unexpected error:", {
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
