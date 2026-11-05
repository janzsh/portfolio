import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact.schema';
import { renderContactEmail } from './email-template';

const parse = (over: Record<string, string> = {}) =>
  contactSchema.parse({ name: 'Ana', email: 'ana@company.com', subject: '', message: 'Hello, I would like to talk.', website: '', ...over });

describe('renderContactEmail', () => {
  it('uses the given subject when there is one', () => {
    expect(renderContactEmail(parse({ subject: 'Role' })).subject).toBe('Portfolio · Role');
  });

  it('falls back to the sender name when there is no subject', () => {
    expect(renderContactEmail(parse()).subject).toBe('Portfolio · message from Ana');
  });

  it('escapes every user-provided field in the HTML body', () => {
    const { html } = renderContactEmail(parse({ name: '"><img src=x>', subject: '<b>hi</b>', message: '<script>alert(1)</script> and more' }));
    expect(html).not.toMatch(/<(script|img|b)[ >]/);
  });

  it('keeps the plain-text body readable and unescaped', () => {
    const { text } = renderContactEmail(parse({ message: 'a < b & c > d, ok' }));
    expect(text).toContain('a < b & c > d, ok');
  });
});
