import { BaseController } from './base.controller.js';
import { HTTP_STATUS } from '#constants';

export * from './base.controller.js';
export * from './auth/index.js';
export * from './user/index.js';

export class Controller extends BaseController {
  #authController;
  #userController;

  constructor({ authController, userController }) {
    super();
    this.#authController = authController;
    this.#userController = userController;
  }

  routes() {
    this.router.use('/auth', this.#authController.routes());
    this.router.use('/users', this.#userController.routes());

    this.router.get('/ping', (req, res) => this.ping(req, res));

    return this.router;
  }

  ping(req, res) {
    const message = `현재 시간:${new Date().toISOString()}`;
    res.status(HTTP_STATUS.OK).json({ message });
  }
}
