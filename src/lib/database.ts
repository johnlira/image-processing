import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.info("DATABASE CONNECTED");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
