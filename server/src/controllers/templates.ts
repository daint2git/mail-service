import { Router, Response } from 'express';
import { IController } from '../types';
import db from '../database/db.json';

interface ITemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
}

class TemplatesController implements IController {
  public path = 'templates';

  public router = Router();

  constructor() {
    this.router.get('/', this.index);
  }

  private index = (_: unknown, res: Response) => {
    res.status(200).json({ message: 'OK', data: db.templates });
  };
}

export default TemplatesController;
