import { Response } from "express";
import { tokenService } from "./token";

export const logoutService = (res: Response): void => {
  tokenService.clearTokenCookie(res);
};
