import fastify, { FastifyInstance } from 'fastify';

import { Logger } from 'pino';
import { Disposable } from '../core/disposing';
import { AppConfig } from '../core/environment';
import { UserController } from '../modules/users/controller';
import { RouteLoader } from './routes';

export class Server implements Disposable {
  private appConfig: AppConfig;
  private logger: Logger;
  private serverInstance: FastifyInstance | null;
  private registerRoutes: RouteLoader;

  public constructor(
    logger: Logger,
    appConfig: AppConfig,
    userController: UserController,
    registerRoutes: RouteLoader
  ) {
    this.appConfig = appConfig;
    this.logger = logger;
    this.serverInstance = null;
    this.registerRoutes = registerRoutes;
  }

  public start(): void {
    const { port } = this.appConfig.server;
    this.serverInstance = fastify({ logger: this.logger });
    this.registerRoutes(this.serverInstance);

    this.serverInstance.listen(port, (err) => {
      if (err) {
        this.logger.error(err);
        process.exit(1);
      }
    });
  }

  public async dispose(): Promise<void> {
    if (!this.serverInstance) {
      this.logger.info('Server instance not found to dispose');
      return Promise.resolve();
    }

    try {
      await this.serverInstance.close();
      this.logger.info('Server disposed successfully.');
    } catch (err) {
      this.logger.error(err, 'Error while disposing the server');
    }
  }
}
