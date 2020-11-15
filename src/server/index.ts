import http from 'http';

import { Logger } from 'pino';
import { Disposable } from '../core/disposing';
import { AppConfig } from '../core/environment';

export class Server implements Disposable {
  private appConfig: AppConfig;
  private logger: Logger;
  private serverInstance: http.Server | null;

  public constructor(logger: Logger, appConfig: AppConfig) {
    this.appConfig = appConfig;
    this.logger = logger;
    this.serverInstance = null;
  }

  public start(): void {
    const { port } = this.appConfig.server;

    this.serverInstance = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ hello: 'world' }));
    });

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
