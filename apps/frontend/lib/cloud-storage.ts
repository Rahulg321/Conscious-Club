import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  },
});

const BUCKET = process.env.GCLOUD_BUCKET;

export const uploadFile = async (file: File) => {
  try {
    // Validate file size (max 200MB)
    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
    if (file.size > MAX_FILE_SIZE) {
      console.error("File size exceeds maximum allowed size of 200MB");
      return null;
    }

    const bucket = storage.bucket(BUCKET as string);

    // Generate unique filename with timestamp to prevent collisions
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", resolve);
      blobStream.end(buffer);
    });

    return blob.publicUrl();
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
