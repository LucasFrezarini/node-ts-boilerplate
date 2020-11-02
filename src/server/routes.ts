import { Router } from 'express';
import { AppCradle } from '../container';

export type AppRoutes = Map<string, Router>;

export const getAppRoutes = ({ userController }: AppCradle): AppRoutes => {
  const routes = new Map<string, Router>();

  routes.set('/users', userController.getRouter());

  return routes;
};
