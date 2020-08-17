import { Router, Response } from 'express';
import { IController } from '../types';

class HomeController implements IController {
  public path = 'home';

  public router = Router();

  constructor() {
    this.router.get('/', this.index);
  }

  private index = (_: unknown, res: Response) => {
    res.status(200).json({ message: 'Hello' });
  };
}

export default HomeController;
