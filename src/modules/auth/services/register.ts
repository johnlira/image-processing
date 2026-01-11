import { CreateUserInput, CreateUserOutput } from "../auth.schemas";
import { authRepository } from "../auth.repository";
import { hash } from "bcryptjs";
import { ConflictError } from "../../../errors/app-errors";

export const registerService = async (body: CreateUserInput): Promise<CreateUserOutput> => {
  const { name, email, password } = body;

  const emailExists = await authRepository.emailExists(email);

  if (emailExists) {
    throw new ConflictError("Email already in use");
  }

  const password_hash = await hash(password, 10);

  const user = await authRepository.createUser({ name, email, password_hash });

  return user;
};
