import { z } from "zod";
import { projectUploadSchema } from "./project-upload-schema";

// Extends the standard project upload schema to require collaboratorId
export const mashupProjectUploadSchema = projectUploadSchema.extend({
  collaboratorId: z.string().min(1, "Collaborator ID is required"),
});

export type MashupProjectUploadData = z.infer<typeof mashupProjectUploadSchema>;


