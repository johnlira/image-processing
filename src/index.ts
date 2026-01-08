import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./errors/error-handler";
import logger from "./config/logger";
import { env } from "./config/env";

const app = express();

app.use(cors());
app.use(logger);
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.info(`Server is running on port ${env.PORT}`);
});
