import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
} from 'awilix';
import { Logger } from 'pino';
import VError from 'verror';
import { Disposable } from '../core/disposing';
import { AppConfig, getAppConfig } from '../core/environment';
import { Server } from '../server';
import { getLogger } from '../utils/logger';
import { UserController, UserService } from '../modules/users';
import { Controller } from '../server/controller';

export interface AppCradle {
  appConfig: AppConfig;
  logger: Logger;
  server: Server;

  userController: Controller;
  userService: UserService;
}

export type AppContainer = AwilixContainer<AppCradle>;

const disposeHandler = (module: Disposable): void | Promise<void> =>
  module.dispose();

export const createAppContainer = async (
  overrides?: Record<string, unknown>
): Promise<AwilixContainer<AppCradle>> => {
  const container = createContainer<AppCradle>();

  try {
    const appConfig = await getAppConfig(process.env);

    container.register({
      appConfig: asValue(appConfig),
      logger: asFunction(getLogger).singleton(),
      server: asClass(Server).singleton().disposer(disposeHandler),
      userController: asClass(UserController).singleton(),
      userService: asClass(UserService).singleton(),
      ...overrides,
    });

    return container;
  } catch (err) {
    throw new VError(
      {
        cause: err,
      },
      'error while initializing the App container'
    );
  }
};
