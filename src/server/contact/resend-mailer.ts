import { Resend } from 'resend';
import type { Mailer, MailMessage } from './mailer';

/** Adapter for the Resend API. */
export class ResendMailer implements Mailer {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send({ to, from, replyTo, subject, html, text }: MailMessage): Promise<void> {
    const { error } = await this.client.emails.send({ to, from, replyTo, subject, html, text });
    if (error) throw new Error(`Resend: ${error.message}`);
  }
}
