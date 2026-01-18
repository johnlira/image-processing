import sharp from "sharp";
import { s3Service } from "../../../utils/s3";
import AppError from "../../../errors/app-errors";
import { imagesRepository } from "../images.repository";
import { NotFoundError } from "../../../errors/app-errors";
import type { ImageOutput } from "../images.schemas";

interface UpdateImageParams {
  file: Express.Multer.File;
  userId: string;
  imageId: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

export const updateImage = async (params: UpdateImageParams): Promise<ImageOutput> => {
  const existingImage = await imagesRepository.findById(params.imageId);

  if (!existingImage || existingImage.userId !== params.userId) {
    throw new NotFoundError("Image");
  }

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

  try {
    await s3Service.deleteFromS3(existingImage.storageKey);
  } catch (error) {
    throw new AppError(
      `Failed to delete old image from S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      500,
      "FAILED_TO_DELETE_OLD_IMAGE_FROM_S3"
    );
  }

  try {
    await s3Service.uploadToS3({
      buffer: processedBuffer,
      mimetype: params.file.mimetype,
      userId: params.userId,
      originalName: params.file.originalname,
      storageKey: existingImage.storageKey,
    });
  } catch (error) {
    throw new AppError(
      `Failed to upload new image to S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      500,
      "FAILED_TO_UPLOAD_NEW_IMAGE_TO_S3"
    );
  }

  const updatedImage = await imagesRepository.update(params.imageId, params.userId, {
    originalName: params.file.originalname,
    mimeType: params.file.mimetype,
    size: params.file.size,
    dimensions: metadata,
  });

  const url = await s3Service.getPresignedUrl(updatedImage.storageKey);

  return { ...updatedImage, url };
};
