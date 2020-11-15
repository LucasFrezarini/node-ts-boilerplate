import { FastifyInstance, FastifyRequest } from 'fastify';
import { Logger } from 'pino';
import { User, UserService } from './service';

import { GetByIdRequest, schema as getByIdSchema } from './schemas/get-by-id';

export class UserController {
  private userService: UserService;
  private logger: Logger;

  public constructor(userService: UserService, logger: Logger) {
    this.userService = userService;
    this.logger = logger;
  }

  public async getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  public async getById(
    req: FastifyRequest<GetByIdRequest>
  ): Promise<User | undefined> {
    const { id } = req.params;

    return this.userService.getUserById(id);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get('/', this.getAll.bind(this));
    server.get('/:id', { schema: getByIdSchema }, this.getById.bind(this));

    this.logger.debug('Registered UserController routes');
  }
}
