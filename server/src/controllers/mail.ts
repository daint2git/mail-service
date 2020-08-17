import { Router, Request, Response, NextFunction } from 'express';
import nodemailer, { TestAccount } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { IController } from '../types';

interface IMail {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

interface IMailConfig {
  server: 'ethereal' | 'gmail';
  user: string;
  pass: string;
}

class MailController implements IController {
  public path = 'mail';

  public router = Router();

  constructor() {
    this.router.post('/verify-account', this.verifyAccount);
    this.router.post('/generate-test-account', this.generateTestAccount);
    this.router.post('/send-mail', this.sendMail);
  }

  private verifyAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const config = req.body as IMailConfig;

    try {
      const transporter = nodemailer.createTransport({
        host: `smtp.${config.server}.email`,
        port: 587,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      await transporter.verify();

      res.status(200).json({
        message: 'Server is ready to take our messages',
      });
    } catch (error) {
      next(error);
    }
  };

  private generateTestAccount = async (
    _: unknown,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const account: TestAccount = await nodemailer.createTestAccount();

      res.status(200).json({
        message: 'OK',
        data: {
          web: account.web,
          user: account.user,
          pass: account.pass,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  private sendMail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { config, mail } = req.body as { config: IMailConfig; mail: IMail };

    try {
      const transporter = nodemailer.createTransport({
        host: `smtp.${config.server}.email`,
        port: 587,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      const info = (await transporter.sendMail({
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        cc: mail.cc,
        bcc: mail.bcc,
        html: mail.body,
      })) as SMTPTransport.SentMessageInfo;

      res.status(200).json({
        message: 'Mail sent successfully.',
        data: {
          info,
          previewUrl:
            config.server === 'ethereal'
              ? nodemailer.getTestMessageUrl(info)
              : null,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MailController;
