import { imagesRepository } from "../images.repository";
import { s3Service } from "../../../utils/s3";
import type { ImageOutput } from "../images.schemas";

export const getImages = async (userId: string): Promise<ImageOutput[]> => {
  const images = await imagesRepository.findByUserId(userId);

  const imagesWithUrls = await Promise.all(
    images.map(async (image) => ({
      ...image,
      url: await s3Service.getPresignedUrl(image.storageKey),
    }))
  );

  return imagesWithUrls;
};