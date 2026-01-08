import { Request, Response, NextFunction } from "express";
import AppError, { ValidationError } from "./app-errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    const response: any = {
      code: err.code,
      message: err.message,
    };

    if (err instanceof ValidationError && err.details) {
      response.errors = err.details;
    }

    return res.status(err.statusCode).send(response);
  }
  res.status(500).send({
    code: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred",
  });
};
