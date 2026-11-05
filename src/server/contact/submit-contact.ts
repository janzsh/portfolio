import type { ContactInput } from './contact.schema';
import { renderContactEmail } from './email-template';
import type { Mailer } from './mailer';
import type { RateLimiter } from './rate-limiter';

export type SubmitResult = 'sent' | 'rate_limited' | 'ignored';

export interface SubmitContactDeps {
  mailer: Mailer;
  limiter: RateLimiter;
  to: string;
  from: string;
}

/** Use case: validate-already-done input -> guard -> notify. Framework agnostic. */
export function createSubmitContact({ mailer, limiter, to, from }: SubmitContactDeps) {
  return async (input: ContactInput, clientKey: string): Promise<SubmitResult> => {
    // Bots fill the honeypot; pretend success so they learn nothing.
    if (input.website) return 'ignored';
    if (!limiter.allow(clientKey)) return 'rate_limited';

    const { subject, html, text } = renderContactEmail(input);
    await mailer.send({ to, from, replyTo: input.email, subject, html, text });
    return 'sent';
  };
}
