import pino from 'pino';

export const getLogger = (): pino.Logger => {
  return pino();
};
