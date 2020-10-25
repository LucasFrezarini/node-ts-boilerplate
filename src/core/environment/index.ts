import * as yup from 'yup';
import { VError } from 'verror';

export interface AppConfig {
  server: ServerConfig;
  env: string;
}

export interface ServerConfig {
  port: number;
}

export type Env = Record<string, string | undefined>;

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

export const getAppConfig = async (env: Env): Promise<AppConfig> => {
  try {
    return await parseEnvironmentVariables(env);
  } catch (err) {
    throw new VError(
      {
        cause: err,
      },
      'error while parsing environment variables'
    );
  }
};

const parseEnvironmentVariables = async (env: Env): Promise<AppConfig> => {
  const environmentVars = await envSchema.validate({
    SERVER_PORT: env.SERVER_PORT,
    NODE_ENV: env.NODE_ENV,
  });

  return {
    server: {
      port: environmentVars.SERVER_PORT,
    },
    env: environmentVars.NODE_ENV,
  };
};
