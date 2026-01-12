import { Request, Response } from "express";
import { CreateUserInput, LoginInput } from "./auth.schemas";
import { registerService } from "./services/register";
import { loginService } from "./services/login";
import { tokenService } from "./services/token";
import { getCurrentUserService } from "./services/get-current-user";
import { logoutService } from "./services/logout";

export const authControllers = {
  register: async (req: Request, res: Response) => {
    const body = req.body as CreateUserInput;
    const user = await registerService(body);
    const token = tokenService.generateToken(user.id);
    tokenService.setTokenCookie(res, token);
    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  },
  login: async (req: Request, res: Response) => {
    const body = req.body as LoginInput;
    const user = await loginService(body);
    const token = tokenService.generateToken(user.id);
    tokenService.setTokenCookie(res, token);
    return res.status(200).json({
      message: "Logged in successfully",
      data: user,
    });
  },
  getCurrentUser: async (req: Request, res: Response) => {
    const userId = req.userId!;
    const user = await getCurrentUserService(userId);
    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  },
  logout: async (req: Request, res: Response) => {
    logoutService(res);
    return res.status(200).json({
      message: "Logged out successfully",
    });
  },
};
