import { Response, Request } from "express";
import { uploadImage } from "./services/upload-image";
import { getImages } from "./services/get-images";
import { getImageById } from "./services/get-image-by-id";
import { deleteImage } from "./services/delete-image";
import { updateImage } from "./services/update-image";

interface MulterRequest extends Express.Request {
  file?: Express.Multer.File;
}

export const imagesControllers = {
  uploadImages: async (req: MulterRequest, res: Response) => {
    const file = req.file!;
    const image = await uploadImage({ file, userId: req.userId! });
    return res.status(200).json({
      message: "Image uploaded successfully",
      data: image,
    });
  },

  getUserImages: async (req: Request, res: Response) => {
    const images = await getImages(req.userId!);
    return res.status(200).json({
      message: "Images retrieved successfully",
      data: images,
    });
  },

  getImageById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = await getImageById(req.userId!, id);
    return res.status(200).json({
      message: "Image retrieved successfully",
      data: image,
    });
  },

  deleteImage: async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteImage(req.userId!, id);
    return res.status(200).json({
      message: "Image deleted successfully",
    });
  },

  updateImage: async (req: MulterRequest, res: Response) => {
    const { id } = req.params;
    const file = req.file!;
    const image = await updateImage({ file, userId: req.userId!, imageId: id });
    return res.status(200).json({
      message: "Image updated successfully",
      data: image,
    });
  },
};
