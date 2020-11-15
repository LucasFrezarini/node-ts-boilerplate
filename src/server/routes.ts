import { FastifyInstance } from 'fastify';
import { AppCradle } from '../container';

export type RouteLoader = (server: FastifyInstance) => Promise<void>;

export const getRouteLoader = ({ userController }: AppCradle) => {
  return async (server: FastifyInstance): Promise<void> => {
    server.register(userController.registerRoutes.bind(userController), {
      prefix: '/users',
    });
  };
};
