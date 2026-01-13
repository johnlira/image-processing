import { Response } from "express";
import { uploadImage } from "./services/upload-image";
import { ValidationError } from "../../errors/app-errors";

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
};
