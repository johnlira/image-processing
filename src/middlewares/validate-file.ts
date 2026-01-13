import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/app-errors";

interface FileValidation {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
}

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const validateFile = (options: FileValidation = {}) => {
  // Default values if not provided
  const {
    allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"],
    maxFileSize = 10 * 1024 * 1024, // 10MB
  } = options;

  return (req: MulterRequest, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      throw new ValidationError([
        {
          field: "file",
          message: "No file uploaded",
        },
      ]);
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new ValidationError([
        {
          field: "file",
          message: `File type not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`,
        },
      ]);
    }

    if (file.size > maxFileSize) {
      throw new ValidationError([
        {
          field: "file",
          message: `File size exceeds maximum of ${maxFileSize / 1024 / 1024}MB`,
        },
      ]);
    }

    next();
  };
};
