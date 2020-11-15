import pino from 'pino';
import { AppConfig } from '../../core/environment';

export const getLogger = (appConfig: AppConfig): pino.Logger => {
  return pino({
    level: appConfig.env === 'test' ? 'silent' : 'info',
  });
};
