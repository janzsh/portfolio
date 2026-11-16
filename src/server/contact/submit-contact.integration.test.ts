import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { contactSchema } from './contact.schema';
import { InMemoryRateLimiter } from './rate-limiter';
import { ResendMailer } from './resend-mailer';
import { createSubmitContact } from './submit-contact';

const input = contactSchema.parse({
  name: 'Ana Torres',
  email: 'ana@example.com',
  subject: 'New project',
  message: 'Can we build <b>this</b> & launch it?\nThanks!',
});

const fetchMock = vi.fn<typeof fetch>();
const setup = (limit = 3) => createSubmitContact({
  mailer: new ResendMailer('re_test_key'),
  limiter: new InMemoryRateLimiter(limit, 60_000, () => 1000),
  to: 'owner@example.com',
  from: 'Portfolio <portfolio@example.com>',
});

describe('contact delivery through Resend', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => Response.json({ id: 'email-test-id' }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('RESEND_BASE_URL', 'https://api.resend.com');
    vi.stubEnv('RESEND_DEBUG', 'false');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('delivers to the configured inbox with the visitor as reply-to and safe HTML', async () => {
    expect(await setup()(input, 'client-a')).toBe('sent');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(request?.method).toBe('POST');
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer re_test_key');

    const body = JSON.parse(String(request?.body));
    expect(body).toMatchObject({
      to: 'owner@example.com',
      from: 'Portfolio <portfolio@example.com>',
      reply_to: 'ana@example.com',
      subject: 'Portfolio · New project',
      text: 'From: Ana Torres <ana@example.com>\nSubject: New project\n\nCan we build <b>this</b> & launch it?\nThanks!',
    });
    expect(body.html).toContain('Can we build &lt;b&gt;this&lt;/b&gt; &amp; launch it?');
    expect(body.html).not.toContain('<b>this</b>');
  });

  it('ignores honeypot submissions without sending or using the client allowance', async () => {
    const submit = setup(1);

    expect(await submit({ ...input, website: 'https://spam.example.com' }, 'client-a')).toBe('ignored');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await submit(input, 'client-a')).toBe('sent');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('stops excess messages before reaching the provider and leaves other clients unaffected', async () => {
    const submit = setup(1);

    expect(await submit(input, 'client-a')).toBe('sent');
    expect(await submit(input, 'client-a')).toBe('rate_limited');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await submit(input, 'client-b')).toBe('sent');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    { status: 422, name: 'validation_error', message: 'Sender address is invalid' },
    { status: 429, name: 'rate_limit_exceeded', message: 'Too many requests' },
    { status: 500, name: 'application_error', message: 'Service unavailable' },
  ])('propagates a provider error ($status) instead of reporting a sent message', async ({ status, name, message }) => {
    fetchMock.mockResolvedValueOnce(Response.json({ name, message, statusCode: status }, { status }));

    await expect(setup()(input, 'client-a')).rejects.toThrow(`Resend: ${message}`);
  });

  it('rejects delivery when the provider cannot be reached', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(setup()(input, 'client-a')).rejects.toThrow();
  });

  it('rejects a provider outage even when its response is not JSON', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<h1>Bad Gateway</h1>', { status: 502 }));

    await expect(setup()(input, 'client-a')).rejects.toThrow();
  });
});
