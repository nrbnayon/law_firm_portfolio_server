export type ISendEmail = {
  to: string;
  subject: string;
  html: string;
};

export interface ICreateAccount {
  email: string;
  name: string;
  otp: number;
}

export interface IResetPassword {
  email: string;
  otp: number;
}

export interface INewsletterSubscriber {
  email: string;
  name: string;
}
