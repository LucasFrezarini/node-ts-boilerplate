import pino from 'pino';
import { AppCradle } from '../../container';

export const getLogger = ({ appConfig }: AppCradle): pino.Logger => {
  return pino({
    level: appConfig.env === 'test' ? 'silent' : 'info',
  });
};
