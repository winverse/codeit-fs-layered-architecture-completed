import { UnauthorizedException } from '#exceptions';

export class AuthMiddleware {
  #tokenProvider;
  #authService;
  #cookieProvider;

  constructor({ tokenProvider, authService, cookieProvider }) {
    this.#tokenProvider = tokenProvider;
    this.#authService = authService;
    this.#cookieProvider = cookieProvider;
  }

  async authenticate(req, res, next) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      return next();
    }

    const accessPayload = accessToken
      ? this.#tokenProvider.verifyAccessToken(accessToken)
      : null;
    const isValidAccess = Boolean(accessPayload?.userId);
    const needsRenewal =
      !isValidAccess ||
      this.#tokenProvider.shouldRefreshAccessToken(accessPayload);
    const renewed =
      needsRenewal && refreshToken
        ? await this.#renewTokens(refreshToken)
        : null;

    if (renewed) {
      this.#cookieProvider.setAuthCookies(res, renewed.tokens);
      req.user = { id: renewed.user.id };
      return next();
    }

    if (isValidAccess) {
      req.user = { id: accessPayload.userId };
      return next();
    }

    this.#cookieProvider.clearAuthCookies(res);
    return next();
  }

  // Refresh Token으로 새 토큰을 발급받습니다. 인증 실패면 null을 돌려주고, 그 밖의 오류는 다시 던집니다.
  async #renewTokens(refreshToken) {
    try {
      return await this.#authService.refreshTokens(refreshToken);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return null;
      }
      throw error;
    }
  }
}
