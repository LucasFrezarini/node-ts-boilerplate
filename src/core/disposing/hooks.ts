import { Logger } from 'pino';
import { container } from '../../container';

const disposeHandler = (): Promise<void> => {
  const logger = container.resolve<Logger>('logger');
  logger.info('Disposing app...');

  return container.dispose();
};

export const appendProcessExitListeners = (): void => {
  process.on('SIGINT', disposeHandler);
  process.on('SIGTERM', disposeHandler);
};
