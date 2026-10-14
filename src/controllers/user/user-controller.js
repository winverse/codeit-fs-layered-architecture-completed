import { BaseController } from '#controllers';
import { HTTP_STATUS } from '#constants';
import { validate, needsLogin } from '#middlewares';
import {
  createUserSchema,
  userIdParamSchema,
  updateUserSchema,
} from './dto/user-dto.js';

export class UserController extends BaseController {
  #userService;

  constructor({ userService }) {
    super();
    this.#userService = userService;
  }

  routes() {
    this.router.get('/', (req, res) => this.getUsers(req, res));
    this.router.get(
      '/:userId',
      validate('params', userIdParamSchema),
      (req, res) => this.getUser(req, res),
    );
    this.router.post('/', validate('body', createUserSchema), (req, res) =>
      this.createUser(req, res),
    );
    this.router.patch(
      '/:userId',
      needsLogin,
      validate('params', userIdParamSchema),
      validate('body', updateUserSchema),
      (req, res) => this.updateUser(req, res),
    );
    this.router.delete(
      '/:userId',
      needsLogin,
      validate('params', userIdParamSchema),
      (req, res) => this.deleteUser(req, res),
    );
    return this.router;
  }

  async getUsers(req, res) {
    const users = await this.#userService.listUsers();
    res.status(HTTP_STATUS.OK).json(users);
  }

  async getUser(req, res) {
    const { userId } = req.params;
    const user = await this.#userService.getUserDetail(userId);
    res.status(HTTP_STATUS.OK).json(user);
  }

  async createUser(req, res) {
    const { email, password, name } = req.body;
    const newUser = await this.#userService.registerUser({
      email,
      password,
      name,
    });
    res.status(HTTP_STATUS.CREATED).json(newUser);
  }

  async updateUser(req, res) {
    const { userId } = req.params;
    const { email, name } = req.body;
    const updatedUser = await this.#userService.changeProfile(
      userId,
      req.user.id,
      {
        email,
        name,
      },
    );
    res.status(HTTP_STATUS.OK).json(updatedUser);
  }

  async deleteUser(req, res) {
    const { userId } = req.params;
    await this.#userService.deleteAccount(userId, req.user.id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  }
}
