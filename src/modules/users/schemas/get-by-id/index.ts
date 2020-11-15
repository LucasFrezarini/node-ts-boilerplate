import { RequestGenericInterface } from 'fastify';
import { UsersGetByIdParamsSchema } from '../../../../../types/generated/users.get-by-id.params';
import params from './users.get-by-id.params.json';

export const schema = {
  params,
};

export interface GetByIdRequest extends RequestGenericInterface {
  Params: UsersGetByIdParamsSchema;
}
