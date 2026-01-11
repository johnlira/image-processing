import { Request, Response } from "express";
import { CreateUserInput } from "./auth.schemas";
import { registerService } from "./services/register";

export const authControllers = {
  register: async (req: Request, res: Response) => {
    const body = req.body as CreateUserInput;
    const user = await registerService(body);
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  },
};
