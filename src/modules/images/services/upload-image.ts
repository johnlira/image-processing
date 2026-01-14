import sharp from "sharp";
import { s3Service } from "../../../utils/s3";
import AppError from "../../../errors/app-errors";
import { imagesRepository } from "../images.repository";
import type { ImageOutput } from "../images.schemas";

interface UploadImageParams {
  file: Express.Multer.File;
  userId: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

export const uploadImage = async (params: UploadImageParams): Promise<ImageOutput> => {
  let metadata: ImageMetadata;
  let processedBuffer: Buffer;

  try {
    const sharpInstance = sharp(params.file.buffer);
    const imageMetadata = await sharpInstance.metadata();

    if (!imageMetadata.width || !imageMetadata.height) {
      throw new AppError("Invalid image: unable to extract dimensions", 400);
    }

    metadata = {
      width: imageMetadata.width,
      height: imageMetadata.height,
      format: imageMetadata.format || "unknown",
    };

    processedBuffer = params.file.buffer;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Failed to process image. File may be corrupted or invalid.",
      400,
    );
  }

  const storageKey = await s3Service.uploadToS3({
    buffer: processedBuffer,
    mimetype: params.file.mimetype,
    userId: params.userId,
    originalName: params.file.originalname,
  });

  const image = await imagesRepository.create({
    userId: params.userId,
    originalName: params.file.originalname,
    storageKey,
    mimeType: params.file.mimetype,
    size: params.file.size,
    dimensions: metadata,
  });

  const url = await s3Service.getPresignedUrl(image.storageKey);

  return { ...image, url };
};
