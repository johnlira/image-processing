import { imagesRepository } from "../images.repository";
import { s3Service } from "../../../utils/s3";
import { NotFoundError } from "../../../errors/app-errors";
import AppError from "../../../errors/app-errors";

export const deleteImage = async (userId: string, id: string): Promise<void> => {
  const image = await imagesRepository.findById(id);

  if (!image || image.userId !== userId) {
    throw new NotFoundError("Image");
  }

  try {
    await s3Service.deleteFromS3(image.storageKey);
  } catch (error) {
    throw new AppError(
      `Failed to delete image from S3: ${error instanceof Error ? error.message : "Unknown error"}`,
      500,
      "FAILED_TO_DELETE_FROM_S3"
    );
  }

  const deleted = await imagesRepository.delete(id, userId);

  if (!deleted) {
    throw new AppError(
      "Failed to delete image from database",
      500,
      "FAILED_TO_DELETE_FROM_DATABASE"
    );
  }
};
