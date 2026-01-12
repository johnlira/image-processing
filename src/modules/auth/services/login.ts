import { authRepository } from "../auth.repository";
import { LoginInput, CreateUserOutput } from "../auth.schemas";
import { compare } from "bcryptjs";
import { UnauthorizedError } from "../../../errors/app-errors";

export const loginService = async (body: LoginInput): Promise<CreateUserOutput> => {
  const { email, password } = body;

  // find user by email e return password_hash
  const user = await authRepository.findUserByEmailWithPassword(email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const userData = await authRepository.findUserById(user.id);

  if (!userData) {
    throw new UnauthorizedError("User not found");
  }

  return userData;
};
