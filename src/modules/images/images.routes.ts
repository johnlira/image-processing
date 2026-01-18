import { Router } from "express";
import { upload } from "../../middlewares/file-upload";
import { imagesControllers } from "./images.controllers";
import { validateFile } from "../../middlewares/validate-file";
import { authenticated } from "../../middlewares/authenticated";

export const imagesRoutes = Router();

imagesRoutes.post(
  "/",

  authenticated,
  upload.single("image"),
  validateFile({
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/jpg",
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  }),
  imagesControllers.uploadImages,
);
imagesRoutes.get("/", authenticated, imagesControllers.getUserImages);
imagesRoutes.put(
  "/:id",
  authenticated,
  upload.single("image"),
  validateFile({
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/jpg",
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  }),
  imagesControllers.updateImage,
);
imagesRoutes.delete("/:id", authenticated, imagesControllers.deleteImage);
imagesRoutes.get("/:id", authenticated, imagesControllers.getImageById);

export default imagesRoutes;
