import http from 'http';
import express from 'express';
import pinoHttp from 'pino-http';
import helmet from 'helmet';

import { Logger } from 'pino';
import { AppCradle } from '../container';
import { Disposable } from '../core/disposing';
import { AppConfig } from '../core/environment';
import { Controller } from './controller';

export class Server implements Disposable {
  private appConfig: AppConfig;
  private logger: Logger;
  private serverInstance: http.Server | null;
  private controllers: Record<string, Controller>;

  public constructor({ logger, appConfig, userController }: AppCradle) {
    this.appConfig = appConfig;
    this.logger = logger;
    this.serverInstance = null;

    this.controllers = {
      '/users': userController,
    };
  }

  public start(): void {
    const { port } = this.appConfig.server;

    const app = express();
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(pinoHttp({ logger: this.logger }));

    Object.keys(this.controllers).forEach((basePath) =>
      app.use(basePath, this.controllers[basePath].getRouter())
    );

    this.serverInstance = http.createServer(app);

    this.serverInstance.listen(port, () => {
      this.logger.info(`Server running at port ${port}`);
    });
  }

  public dispose(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.serverInstance) {
        return resolve();
      }

      this.serverInstance.close((err) => {
        if (err) {
          this.logger.info('Error while disposing server', err);
          return reject(err);
        }

        this.logger.info('Server disposed.');
        resolve();
      });
    });
  }
}
