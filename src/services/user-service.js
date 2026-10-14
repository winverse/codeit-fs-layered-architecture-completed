import { ForbiddenException, NotFoundException } from '#exceptions';
import { ERROR_MESSAGE } from '#constants';

export class UserService {
  #userRepository;
  #passwordProvider;

  constructor({ userRepository, passwordProvider }) {
    this.#userRepository = userRepository;
    this.#passwordProvider = passwordProvider;
  }

  async listUsers() {
    return await this.#userRepository.findAll();
  }

  async getUserDetail(userId) {
    const user = await this.#userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }

  async registerUser({ email, password, name }) {
    const hashedPassword = await this.#passwordProvider.hash(password);
    return await this.#userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
  }

  async changeProfile(userId, reqUserId, { email, name }) {
    if (reqUserId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    const existingUser = await this.#userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    return await this.#userRepository.update(userId, {
      email,
      name,
    });
  }

  async deleteAccount(userId, reqUserId) {
    if (reqUserId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN);
    }

    const existingUser = await this.#userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    await this.#userRepository.delete(userId);
  }
}
