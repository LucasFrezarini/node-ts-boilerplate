import http from 'http';

import { Logger } from 'pino';
import { Container } from '../container';
import { Disposable } from '../core/disposing';

export class Server implements Disposable {
  private logger: Logger;
  private serverInstance: http.Server | null;

  public constructor({ logger }: Container) {
    this.logger = logger;
    this.serverInstance = null;
  }

  public start(): void {
    this.serverInstance = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ hello: 'world' }));
    });

    this.serverInstance.listen(3000, () => {
      this.logger.info('Server running at port 3000.');
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
