import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  },
});

const BUCKET = process.env.GCLOUD_BUCKET;

export const uploadFile = async (buffer: Buffer, originalName: string) => {
  try {
    const bucket = storage.bucket(BUCKET as string);

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = originalName.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

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
