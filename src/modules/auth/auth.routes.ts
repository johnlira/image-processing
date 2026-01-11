import { Router } from "express";
import { createUserInputSchema } from "./auth.schemas";
import { validateBody } from "../../middlewares/schema-validate";
import { authControllers } from "./auth.controllers";

const authRoutes = Router();

authRoutes.post("/register", validateBody(createUserInputSchema), authControllers.register);

export default authRoutes;
