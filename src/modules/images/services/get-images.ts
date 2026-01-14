import { imagesRepository } from "../images.repository";

export const getImages = async (userId: string) => {
  return await imagesRepository.findByUserId(userId);
};