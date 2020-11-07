import test, { ExecutionContext } from 'ava';
import pino from 'pino';
import sinon from 'sinon';

import {
  UserController,
  UserService,
  User,
} from '../../../../src/modules/users';

test('getAll should return all users as JSON', (t: ExecutionContext<
  unknown
>) => {
  const userServiceStub = (<unknown>(
    sinon.createStubInstance(UserService)
  )) as UserService;

  const mockedUsers: User[] = [
    {
      id: 1,
      first_name: 'test',
      last_name: '#1',
      email: 'test@test1.com',
    },
    {
      id: 2,
      first_name: 'test',
      last_name: '#2',
      email: 'test@test2.com',
    },
  ];

  userServiceStub.getAllUsers = sinon.mock().returns(mockedUsers);

  const controller = new UserController(
    pino({ level: 'silent' }),
    userServiceStub
  );

  const res = {
    json: sinon.spy(),
  };

  controller.getAll(sinon.stub() as any, res as any);

  t.true(res.json.calledOnceWith(mockedUsers));
});
