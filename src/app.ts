import { createAppContainer } from './container';
import { appendProcessExitListeners } from './core/disposing';
import { Server } from './server';

const init = async () => {
  try {
    const container = await createAppContainer();
    appendProcessExitListeners(container);

    const server = container.resolve<Server>('server');
    server.start();
  } catch (err) {
    // the logger wans't initialized successfully, so we have to use console.error
    // eslint-disable-next-line no-console
    console.error('Error while starting the app', err);
    process.exit(1);
  }
};

init();
