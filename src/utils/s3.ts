import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  storageKey?: string;
}

export const s3Service = {
  uploadToS3: async (params: UploadToS3Params) => {
    const storageKey = params.storageKey || (() => {
      const fileExtension = params.originalName?.split(".").pop() || "jpg";
      return `${params.userId}/${randomUUID()}.${fileExtension}`;
    })();

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: storageKey,
      Body: params.buffer,
      ContentType: params.mimetype,
    });

    try {
      await s3Client.send(command);
      return storageKey;
    } catch (error) {
      throw new Error(
        `Failed to upload to S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  getFromS3: async (key: string) => {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    try {
      const response = await s3Client.send(command);
      const buffer = await response.Body?.transformToByteArray();
      return buffer;
    } catch (error) {
      throw new Error(
        `Failed to get from S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  getPresignedUrl: async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  },
  deleteFromS3: async (key: string): Promise<void> => {
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      throw new Error(
        `Failed to delete from S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
};
