import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../config/env";
import { randomUUID } from "node:crypto";

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

interface UploadToS3Params {
  buffer: Buffer;
  mimetype: string;
  userId: string;
  originalName?: string;
}

export const s3Service = {
  uploadToS3: async (params: UploadToS3Params) => {
    const fileExtension = params.originalName?.split(".").pop() || "jpg";
    const uniqueKey = `${params.userId}/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: uniqueKey,
      Body: params.buffer,
      ContentType: params.mimetype,
    });

    try {
      await s3Client.send(command);
      return uniqueKey;
    } catch (error) {
      throw new Error(
        `Failed to upload to S3: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
