import { Response, Request } from "express";
import { uploadImage } from "./services/upload-image";
import { getImages } from "./services/get-images";
import { s3Service } from "../../utils/s3";
import { logger } from "../../config/logger";
import AppError, { ValidationError } from "../../errors/app-errors";

interface MulterRequest extends Express.Request {
  file?: Express.Multer.File;
}

export const imagesControllers = {
  uploadImages: async (req: MulterRequest, res: Response) => {
    const file = req.file!;
    const image = await uploadImage({ file, userId: req.userId! });
    const url = await s3Service.getPresignedUrl(image.storageKey);
    return res.status(200).json({
      message: "Image uploaded successfully",
      data: { ...image, url },
    });
  },
  getUserImages: async (req: Request, res: Response) => {
    logger.info({ userId: req.userId }, "Getting images for user");
    const images = await getImages(req.userId!);
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await s3Service.getPresignedUrl(image.storageKey),
      })),
    );
    return res.status(200).json({
      message: "Images retrieved successfully",
      data: imagesWithUrls,
    });
  },
};
