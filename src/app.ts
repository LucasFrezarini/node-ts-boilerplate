import { container } from './container';
import { appendProcessExitListeners } from './core/disposing';
import { Server } from './server';

appendProcessExitListeners();

const server = container.resolve<Server>('server');
server.start();
