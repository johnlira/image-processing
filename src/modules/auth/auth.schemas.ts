import { z } from "zod";

export const createUserInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createUserOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.coerce.date(),
});

export type CreateUserOutput = z.infer<typeof createUserOutputSchema>;
