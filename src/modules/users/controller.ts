import {
  FastifyInstance,
  FastifyRequest,
  RequestGenericInterface,
} from 'fastify';
import { Logger } from 'pino';
import { User, UserService } from './service';

interface RequestGeneric extends RequestGenericInterface {
  Params: {
    id: number;
  };
}

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
    req: FastifyRequest<RequestGeneric>
  ): Promise<User | undefined> {
    const { id } = req.params;

    return this.userService.getUserById(id);
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get('/', this.getAll.bind(this));
    server.get('/:id', this.getById.bind(this));

    this.logger.debug('Registered UserController routes');
  }
}
