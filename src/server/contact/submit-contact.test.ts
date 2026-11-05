import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact.schema';
import { escapeHtml } from './escape-html';
import { renderContactEmail } from './email-template';
import { InMemoryRateLimiter } from './rate-limiter';
import { createSubmitContact } from './submit-contact';
import type { Mailer, MailMessage } from './mailer';

const valid = { name: 'Ana', email: 'ana@company.com', subject: '', message: 'Hello, I would like to talk.', website: '' };

const setup = (limit = 2) => {
  const sent: MailMessage[] = [];
  const mailer: Mailer = { send: async (m) => void sent.push(m) };
  const submit = createSubmitContact({ mailer, limiter: new InMemoryRateLimiter(limit, 60_000), to: 'me@x.com', from: 'p@x.com' });
  return { sent, submit };
};

describe('contactSchema', () => {
  it('accepts null optional fields from form posts', () => {
    expect(contactSchema.safeParse({ ...valid, subject: null, website: null }).success).toBe(true);
  });
  it('rejects bad email and short message', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: 'short' }).success).toBe(false);
  });
});

describe('submitContact', () => {
  it('sends and sets reply-to', async () => {
    const { sent, submit } = setup();
    expect(await submit(contactSchema.parse(valid), 'ip')).toBe('sent');
    expect(sent[0].replyTo).toBe('ana@company.com');
  });
  it('silently ignores honeypot hits without sending', async () => {
    const { sent, submit } = setup();
    expect(await submit(contactSchema.parse({ ...valid, website: 'http://spam' }), 'ip')).toBe('ignored');
    expect(sent).toHaveLength(0);
  });
  it('rate limits per client', async () => {
    const { submit } = setup(1);
    const input = contactSchema.parse(valid);
    expect(await submit(input, 'a')).toBe('sent');
    expect(await submit(input, 'a')).toBe('rate_limited');
    expect(await submit(input, 'b')).toBe('sent');
  });
});

describe('email template', () => {
  it('escapes user-provided HTML', () => {
    const { html } = renderContactEmail(contactSchema.parse({ ...valid, name: '<script>alert(1)</script>' }));
    expect(html).not.toContain('<script>');
    expect(escapeHtml('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });
});
