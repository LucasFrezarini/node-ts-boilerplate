export const appendProcessExitListeners = (
  appProcess: NodeJS.EventEmitter,
  disposeHandler: (...args: unknown[]) => void
): void => {
  appProcess.on('SIGINT', disposeHandler);
  appProcess.on('SIGTERM', disposeHandler);
};
