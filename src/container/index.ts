import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  InjectionMode,
} from 'awilix';
import { Logger } from 'pino';
import VError from 'verror';
import { Disposable } from '../core/disposing';
import { AppConfig, getAppConfig } from '../core/environment';
import { Server } from '../server';
import { getLogger } from '../utils/logger';

export interface AppCradle {
  appConfig: AppConfig;
  logger: Logger;
  server: Server;
}

export type AppContainer = AwilixContainer<AppCradle>;

const disposeHandler = (module: Disposable): void | Promise<void> =>
  module.dispose();

export const createAppContainer = async (
  overrides?: Record<string, unknown>
): Promise<AwilixContainer<AppCradle>> => {
  const container = createContainer<AppCradle>({
    injectionMode: InjectionMode.CLASSIC,
  });

  try {
    const appConfig = await getAppConfig(process.env);

    container.register({
      appConfig: asValue(appConfig),
      logger: asFunction(getLogger).singleton(),
      server: asClass(Server).singleton().disposer(disposeHandler),
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
