import { asClass, asFunction, createContainer } from 'awilix';
import { Logger } from 'pino';
import { Disposable } from '../core/disposing';
import { Server } from '../server';
import { getLogger } from '../utils/logger';

export interface Container {
  logger: Logger;
  server: Server;
}

const disposeHandler = (module: Disposable): void | Promise<void> =>
  module.dispose();

const container = createContainer<Container>();

container.register({
  logger: asFunction(getLogger).singleton(),
  server: asClass(Server).singleton().disposer(disposeHandler),
});

export { container };
