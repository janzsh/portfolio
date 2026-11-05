import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendContactAction = vi.fn();
vi.mock('astro:actions', () => ({
  actions: { sendContact: (form: FormData) => sendContactAction(form) },
  isInputError: (error: { type?: string }) => error?.type === 'input',
}));

import { sendContact } from './send-contact';

const form = new FormData();

describe('sendContact', () => {
  // Braces matter: a value returned from beforeEach is run as the teardown callback.
  beforeEach(() => {
    sendContactAction.mockReset();
  });

  it('reports success when the action returns no error', async () => {
    sendContactAction.mockResolvedValue({ data: { ok: true }, error: undefined });
    expect(await sendContact(form)).toEqual({ status: 'sent', fieldErrors: {} });
  });

  it('maps input errors to the first message per field', async () => {
    sendContactAction.mockResolvedValue({
      error: { type: 'input', fields: { email: ['Invalid email', 'Too long'], message: ['Too short'] } },
    });
    expect(await sendContact(form)).toEqual({
      status: 'invalid',
      fieldErrors: { email: 'Invalid email', message: 'Too short' },
    });
  });

  it('reports rate limiting', async () => {
    sendContactAction.mockResolvedValue({ error: { code: 'TOO_MANY_REQUESTS' } });
    expect((await sendContact(form)).status).toBe('rate_limited');
  });

  it('reports any other server error', async () => {
    sendContactAction.mockResolvedValue({ error: { code: 'INTERNAL_SERVER_ERROR' } });
    expect((await sendContact(form)).status).toBe('error');
  });

  it('treats a network failure as an error instead of throwing', async () => {
    sendContactAction.mockRejectedValue(new Error('offline'));
    expect(await sendContact(form)).toEqual({ status: 'error', fieldErrors: {} });
  });
});
