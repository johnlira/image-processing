import { Router, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes";
import imagesRoutes from "./modules/images/images.routes";

const routes = Router();

routes.get("/health", (req: Request, res: Response) => res.send({ status: "ok" }));
routes.use("/auth", authRoutes);
routes.use("/images", imagesRoutes);

export default routes;
