import test from 'ava';
import events from 'events';

import { appendProcessExitListeners } from '../../../src/core/disposing';

test('should append the dispose handler when SIGINT is received', async (t) => {
  const processMock = new events.EventEmitter();

  appendProcessExitListeners(processMock, () => {
    t.pass();
  });

  processMock.emit('SIGINT');
});

test('should append the dispose handler when SIGTERM is received', async (t) => {
  const processMock = new events.EventEmitter();

  appendProcessExitListeners(processMock, () => {
    t.pass();
  });

  processMock.emit('SIGTERM');
});
