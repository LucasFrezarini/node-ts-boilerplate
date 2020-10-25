import * as yup from 'yup';
import { VError } from 'verror';

export interface AppConfig {
  server: ServerConfig;
  env: string;
}

export interface ServerConfig {
  port: number;
}

const envSchema = yup
  .object()
  .shape({
    SERVER_PORT: yup.number().positive().required(),
    NODE_ENV: yup
      .string()
      .trim()
      .required()
      .oneOf(['production', 'test', 'development']),
  })
  .required();

export const getAppConfig = async (): Promise<AppConfig> => {
  try {
    return await parseEnvironmentVariables();
  } catch (err) {
    throw new VError(
      {
        cause: err,
      },
      'error while parsing environment variables'
    );
  }
};

const parseEnvironmentVariables = async (): Promise<AppConfig> => {
  const environmentVars = await envSchema.validate({
    SERVER_PORT: process.env.SERVER_PORT,
    NODE_ENV: process.env.NODE_ENV,
  });

  return {
    server: {
      port: environmentVars.SERVER_PORT,
    },
    env: environmentVars.NODE_ENV,
  };
};
