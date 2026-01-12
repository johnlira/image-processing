import { Router } from "express";
import { createUserInputSchema, loginInputSchema } from "./auth.schemas";
import { validateBody } from "../../middlewares/schema-validate";
import { authenticated } from "../../middlewares/authenticated";
import { authControllers } from "./auth.controllers";

const authRoutes = Router();

authRoutes.post("/register", validateBody(createUserInputSchema), authControllers.register);
authRoutes.post("/login", validateBody(loginInputSchema), authControllers.login);
authRoutes.get("/me", authenticated, authControllers.getCurrentUser);
authRoutes.post("/logout", authControllers.logout);

export default authRoutes;
