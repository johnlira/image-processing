import { Router, Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => res.send("in development"));
routes.get("/health", (req: Request, res: Response) => res.send({ status: "ok" }));

export default routes;
