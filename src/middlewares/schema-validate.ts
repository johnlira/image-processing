import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { ValidationError } from "../errors/app-errors";

export const validateBody = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
      }));
      throw new ValidationError(errors);
    }

    req.body = result.data;
    next();
  };
};
