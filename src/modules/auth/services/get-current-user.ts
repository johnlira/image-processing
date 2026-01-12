import { authRepository } from "../auth.repository";
import { CreateUserOutput } from "../auth.schemas";
import { NotFoundError } from "../../../errors/app-errors";

export const getCurrentUserService = async (userId: string): Promise<CreateUserOutput> => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError("User");
  }

  return user;
};
