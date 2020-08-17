import { IRouter } from 'express';

export interface IController {
  path: string;
  router: IRouter;
}
