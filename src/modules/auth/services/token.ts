import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../../config/env";
import { Response } from "express";
import { UnauthorizedError } from "../../../errors/app-errors";

export interface TokenPayload extends JwtPayload {
  sub: string;
}

export const tokenService = {
  generateToken: (userId: string) => {
    return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "1d" });
  },
  verifyToken: (token: string): TokenPayload => {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  },
  setTokenCookie: (res: Response, token: string) => {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 * 24, // 1 day
    });
  },
  clearTokenCookie: (res: Response) => {
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });
  },
};
