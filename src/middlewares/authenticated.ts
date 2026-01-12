import { Request, Response, NextFunction } from "express";
import { tokenService } from "../modules/auth/services/token";
import { UnauthorizedError } from "../errors/app-errors";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthorizedError("Token not provided");
  }

  const decoded = tokenService.verifyToken(token);
  req.userId = decoded.sub;
  next();
};
