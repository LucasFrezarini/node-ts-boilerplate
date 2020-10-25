import test, { ExecutionContext } from 'ava';
import VError from 'verror';
import { ValidationError } from 'yup';
import { AppConfig, getAppConfig } from '../../../src/core/environment';

const getMockedEnv = (
  overrides?: Record<string, string | null>
): Record<string, string | undefined> => ({
  NODE_ENV: 'test',
  SERVER_PORT: '5000',
  ...overrides,
});

const assertGetAppConfigError = async (
  t: ExecutionContext<unknown>,
  env: Record<string, string | undefined>
) => {
  const error = await t.throwsAsync<VError>(getAppConfig(env), {
    instanceOf: VError,
  });

  t.true(
    error.cause() instanceof ValidationError,
    'the cause error was not a ValidationError'
  );
};

test('getAppConfig() returns the appConfig when env variables are valid', async (t) => {
  const mockedEnv = getMockedEnv();

  const expected: AppConfig = {
    server: {
      port: 5000,
    },
    env: 'test',
  };

  const appConfig = await getAppConfig(mockedEnv);

  t.deepEqual(appConfig, expected);
});

test('getAppConfig() should be valid when NODE_ENV is one of production, development or test', async (t) => {
  const validValues = ['production', 'development', 'test'];

  const assertionPromises = validValues.map((value) => {
    const mockedEnv = getMockedEnv({ NODE_ENV: value });
    return t.notThrowsAsync(getAppConfig(mockedEnv));
  });

  await Promise.all(assertionPromises);
});

test('getAppConfig() throws error when NODE_ENV is not defined', async (t) => {
  const mockedEnv = getMockedEnv();
  delete mockedEnv.NODE_ENV;

  await assertGetAppConfigError(t, mockedEnv);
});

test('getAppConfig() throws error when NODE_ENV is invalid', async (t) => {
  const invalidValues = [null, '', 'anything_different_from_prod_dev_or_test'];

  const assertionPromises = invalidValues.map((value) =>
    assertGetAppConfigError(t, getMockedEnv({ NODE_ENV: value }))
  );

  await Promise.all(assertionPromises);
});

test('getAppConfig() throws error when SERVER_PORT is not defined', async (t) => {
  const mockedEnv = getMockedEnv();
  delete mockedEnv.SERVER_PORT;

  await assertGetAppConfigError(t, mockedEnv);
});

test('getAppConfig() throws error when SERVER_PORT is invalid', async (t) => {
  const invalidValues = [null, '', '0', 'string', '-5000'];

  const assertionPromises = invalidValues.map((value) =>
    assertGetAppConfigError(t, getMockedEnv({ SERVER_PORT: value }))
  );

  await Promise.all(assertionPromises);
});
