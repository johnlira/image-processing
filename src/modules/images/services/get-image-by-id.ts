import { imagesRepository } from "../images.repository";
import { s3Service } from "../../../utils/s3";
import { NotFoundError } from "../../../errors/app-errors";
import type { ImageOutput } from "../images.schemas";

export const getImageById = async (userId: string, id: string): Promise<ImageOutput> => {
  const image = await imagesRepository.findById(id);

  if (!image || image.userId !== userId) {
    throw new NotFoundError("Image");
  }

  const url = await s3Service.getPresignedUrl(image.storageKey);

  return { ...image, url };
};
