import express from 'express';
import cors from 'cors';
import App from './app';

import HomeController from './controllers/home';
import MailController from './controllers/mail';
import TemplatesController from './controllers/templates';

const app = new App({
  port: parseInt(process.env.PORT, 10) || 9696,
  middlewares: [cors(), express.json(), express.urlencoded({ extended: true })],
  controllers: [
    new HomeController(),
    new MailController(),
    new TemplatesController(),
  ],
});

app.listen();
