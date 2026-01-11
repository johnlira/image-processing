import { Request, Response, NextFunction } from "express";
import AppError, { ValidationError } from "./app-errors";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      singleLine: true,
      ignore: "pid,hostname",
    },
  },
});

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

  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      req: {
        method: req.method,
        url: req.url,
        body: req.body,
      },
    },
    "Unhandled error"
  );

  res.status(500).send({
    code: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred",
  });
};
