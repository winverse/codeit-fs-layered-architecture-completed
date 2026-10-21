import { ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '#exceptions';

const createAuthorizationMiddleware = (predicate) => (req, res, next) => {
  if (!predicate(req)) {
    throw new UnauthorizedException(ERROR_MESSAGE.UNAUTHORIZED);
  }
  next();
};

const hasLoginUser = (req) => Boolean(req.user);

export const needsLogin = createAuthorizationMiddleware(hasLoginUser);
