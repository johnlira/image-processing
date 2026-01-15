import { z, treeifyError } from "zod";
import "dotenv/config";

const _env = z.object({
  PORT: z.coerce
    .number()
    .min(1, ".env is invalid: PORT not defined")
    .default(3000),
  FRONTEND_URL: z.string().min(1, ".env is invalid: FRONTEND_URL not defined"),
  DATABASE_URL: z.string().min(1, ".env is invalid: DATABASE_URL not defined"),
  JWT_SECRET: z.string().min(1, ".env is invalid: JWT_SECRET not defined"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  AWS_ENDPOINT: z
    .url()
    .min(1, ".env is invalid: AWS_ENDPOINT not defined")
    .default("http://localhost:4566"),
  AWS_REGION: z
    .string()
    .min(1, ".env is invalid: AWS_REGION not defined")
    .default("us-east-1"),
  AWS_ACCESS_KEY_ID: z
    .string()
    .min(1, ".env is invalid: AWS_ACCESS_KEY_ID not defined")
    .default("test"),
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(1, ".env is invalid: AWS_SECRET_ACCESS_KEY not defined")
    .default("test"),
  S3_BUCKET_NAME: z
    .string()
    .min(1, "S3_BUCKET_NAME is required")
    .default("images-bucket"),
});

function validateEnv() {
  const _parsed = _env.safeParse(process.env);
  if (!_parsed.success) {
    console.error(
      "Invalid environment variables",
      treeifyError(_parsed.error).properties
    );
    throw new Error("Invalid environment variables");
  }
  return _parsed.data;
}
export const env = validateEnv();
