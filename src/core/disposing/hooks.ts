import { Logger } from 'pino';
import { AppContainer } from '../../container';

export const appendProcessExitListeners = (container: AppContainer): void => {
  const disposeHandler = (): Promise<void> => {
    const logger = container.resolve<Logger>('logger');
    logger.info('Disposing app...');

    return container.dispose();
  };

  process.on('SIGINT', disposeHandler);
  process.on('SIGTERM', disposeHandler);
};
