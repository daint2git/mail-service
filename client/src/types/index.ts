export interface IMail {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

export interface ITemplate {
  id: number | string | null;
  name: string | null;
  subject: string | null;
  body: string | null;
}

export interface ISelectOption {
  value: string | number | null;
  text: string | null;
}

export interface IAccount {
  web: string;
  server: string;
  user: string;
  pass: string;
}

interface IMailDetailDataSent {
  info: string | null;
  previewUrl: string | null;
}

export interface IMailDetailSent {
  message: string | null;
  data: IMailDetailDataSent | null;
}
