import { pinoHttp } from "pino-http";
import pino from "pino";

const pinoLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      singleLine: true,
      ignore: "pid,hostname",
    },
  },
});

export const logger = pinoHttp({
  logger: pinoLogger,
  customLogLevel: (req, res, err) => {
    if (err) return "error";
    const statusCode = res.statusCode;
    if (!statusCode || statusCode < 400) return "info";
    if (statusCode >= 500) return "error";
    return "warn";
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode || 200}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} ${res.statusCode || 500} - ${err.message}`,
});

export default logger;
