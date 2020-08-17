import express, { Application, RequestHandler } from 'express';
import { IController } from './types';

class App {
  public app: Application;

  public port: number;

  constructor(options: {
    port: number;
    middlewares: RequestHandler[];
    controllers: IController[];
  }) {
    this.app = express();
    this.port = options.port;
    this.injectMiddlewares(options.middlewares);
    this.injectControllers(options.controllers);
  }

  private injectMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  private injectControllers(controllers: IController[]) {
    controllers.forEach(controller => {
      this.app.use(`/api/${controller.path}`, controller.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the http://localhost:${this.port}`);
    });
  }
}

export default App;
