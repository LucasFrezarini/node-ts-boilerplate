import { Request, Response, Router } from 'express';
import { Logger } from 'pino';
import { UserService } from '.';
import { AppCradle } from '../../container';
import { Controller } from '../../server/controller';

export class UserController implements Controller {
  private logger: Logger;
  private userService: UserService;

  public constructor({ logger, userService }: AppCradle) {
    this.logger = logger;
    this.userService = userService;
  }

  public getAll(req: Request, res: Response): void {
    this.logger.debug('fetching all users...');
    res.json(this.userService.getAllUsers());
  }

  public getById(req: Request, res: Response): void {
    const { id } = req.params;

    this.logger.debug(`fetching user by id (id=${id}`);
    const user = this.userService.getUserById(Number(id));

    if (!user) {
      res.status(404).json({ msg: 'user not found ' });
      return;
    }

    res.json(user);
  }

  public getRouter(): Router {
    const router = Router();

    router.get('/', this.getAll.bind(this));
    router.get('/:id', this.getById.bind(this));

    return router;
  }
}
