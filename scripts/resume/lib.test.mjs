import { describe, expect, it } from 'vitest';
import { outputFile, privateEmail } from './lib.mjs';

describe('outputFile', () => {
  it('writes the public PDF under public/, where the site serves it from', () => {
    expect(outputFile('/cv/ada-cv-en.pdf', false)).toBe('public/cv/ada-cv-en.pdf');
  });

  it('writes the private PDF under private/, which is never deployed', () => {
    expect(outputFile('/cv/ada-cv-en.pdf', true)).toBe('private/ada-cv-en.pdf');
  });
});

describe('privateEmail', () => {
  it('reads the address for the private résumé from RESUME_EMAIL', () => {
    expect(privateEmail({ RESUME_EMAIL: 'ada@example.com' })).toBe('ada@example.com');
  });

  it.each([{}, { RESUME_EMAIL: '' }, { RESUME_EMAIL: 'not-an-email' }])('refuses to build without a valid address (%o)', (env) => {
    expect(() => privateEmail(env)).toThrow(/RESUME_EMAIL/);
  });
});
