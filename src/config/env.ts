import { z, treeifyError } from "zod";
import "dotenv/config";

const _env = z.object({
  PORT: z.coerce.number().min(1, ".env is invalid: PORT not defined").default(3000),
  DATABASE_URL: z.string().min(1, ".env is invalid: DATABASE_URL not defined"),
});

function validateEnv() {
  const _parsed = _env.safeParse(process.env);
  if (!_parsed.success) {
    console.error("Invalid environment variables", treeifyError(_parsed.error).properties);
    throw new Error("Invalid environment variables");
  }
  return _parsed.data;
}
export const env = validateEnv();
