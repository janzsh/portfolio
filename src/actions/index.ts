import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { contactSchema } from '../server/contact/contact.schema';
import { InMemoryRateLimiter } from '../server/contact/rate-limiter';
import { ResendMailer } from '../server/contact/resend-mailer';
import { createSubmitContact } from '../server/contact/submit-contact';

// Composition root: the only place that knows the concrete implementations.
const submitContact = createSubmitContact({
  mailer: new ResendMailer(RESEND_API_KEY),
  limiter: new InMemoryRateLimiter(3, 60_000),
  to: CONTACT_TO_EMAIL,
  from: CONTACT_FROM_EMAIL,
});

export const server = {
  sendContact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async (input, { clientAddress }) => {
      const result = await submitContact(input, clientAddress);
      if (result === 'rate_limited') {
        throw new ActionError({ code: 'TOO_MANY_REQUESTS', message: 'rate_limited' });
      }
      return { ok: true as const };
    },
  }),
};
