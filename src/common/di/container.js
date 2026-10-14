import {
  createContainer as createAwilixContainer,
  asClass,
  asValue,
  InjectionMode,
  Lifetime,
} from 'awilix';
import { config } from '#config';
import { db } from '#prisma/db.js';
import { UserRepository } from '#repositories';
import { AuthService, UserService } from '#services';
import { AuthController, UserController, Controller } from '#controllers';
import { PasswordProvider, TokenProvider, CookieProvider } from '#providers';
import { AuthMiddleware } from '#middlewares';

export const createContainer = () => {
  const container = createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  container.register({
    config: asValue(config),
    db: asValue(db),
    userRepository: asClass(UserRepository, {
      lifetime: Lifetime.SINGLETON,
    }),
    passwordProvider: asClass(PasswordProvider, {
      lifetime: Lifetime.SINGLETON,
    }),
    tokenProvider: asClass(TokenProvider, {
      lifetime: Lifetime.SINGLETON,
    }),
    cookieProvider: asClass(CookieProvider, {
      lifetime: Lifetime.SINGLETON,
    }),

    authService: asClass(AuthService, {
      lifetime: Lifetime.SINGLETON,
    }),
    userService: asClass(UserService, {
      lifetime: Lifetime.SINGLETON,
    }),

    authMiddleware: asClass(AuthMiddleware, {
      lifetime: Lifetime.SINGLETON,
    }),

    authController: asClass(AuthController, {
      lifetime: Lifetime.SINGLETON,
    }),
    userController: asClass(UserController, {
      lifetime: Lifetime.SINGLETON,
    }),

    controller: asClass(Controller, {
      lifetime: Lifetime.SINGLETON,
    }),
  });

  return container.cradle;
};
