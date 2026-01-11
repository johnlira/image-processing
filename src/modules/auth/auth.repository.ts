import { pool } from "../../lib/database";
import { CreateUserOutput, createUserOutputSchema } from "./auth.schemas";
import AppError from "../../errors/app-errors";

export const authRepository = {
  findUserByEmail: async (email: string): Promise<CreateUserOutput | null> => {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return createUserOutputSchema.parse(result.rows[0]);
  },

  emailExists: async (email: string): Promise<boolean> => {
    const result = await pool.query("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", [email]);
    if (result.rows.length === 0) {
      return false;
    }
    return result.rows[0].exists;
  },

  createUser: async (data: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<CreateUserOutput> => {
    const { name, email, password_hash } = data;
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, password_hash]
    );

    if (result.rows.length === 0) {
      throw new AppError("Failed to create user", 500, "FAILED_TO_CREATE_USER");
    }

    return createUserOutputSchema.parse(result.rows[0]);
  },
};
