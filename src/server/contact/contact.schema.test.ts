import { describe, expect, it } from 'vitest';
import { contactSchema } from './contact.schema';

const valid = {
  name: 'Ana Torres',
  email: 'ana@example.com',
  message: 'I would like to discuss a project.',
};

describe('contactSchema', () => {
  it('trims human-entered text while preserving the message line breaks', () => {
    expect(contactSchema.parse({
      name: '  Ana Torres  ',
      email: 'ana@example.com',
      subject: '  New project  ',
      message: '  Hello Ana,\nCan we talk?  ',
      website: '   ',
    })).toEqual({
      name: 'Ana Torres',
      email: 'ana@example.com',
      subject: 'New project',
      message: 'Hello Ana,\nCan we talk?',
      website: '',
    });
  });

  it.each([undefined, null, ''])('normalizes empty optional fields (%s) to strings', (value) => {
    expect(contactSchema.parse({ ...valid, subject: value, website: value })).toEqual({
      name: 'Ana Torres',
      email: 'ana@example.com',
      message: 'I would like to discuss a project.',
      subject: '',
      website: '',
    });
  });

  it.each([
    ['name', undefined],
    ['email', undefined],
    ['message', undefined],
    ['name', ' A '],
    ['name', '   '],
    ['message', '123456789'],
    ['message', '          '],
    ['email', 'ana@example.com\r\nBcc: spam@example.com'],
    ['name', 42],
    ['message', null],
  ] as const)('rejects invalid %s input (%s) and identifies the field', (field, value) => {
    const result = contactSchema.safeParse({ ...valid, [field]: value });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: [field] }),
    ]));
  });

  it('accepts the minimum name and message lengths', () => {
    expect(contactSchema.safeParse({ ...valid, name: 'Al', message: '1234567890' }).success).toBe(true);
  });

  it.each([
    { field: 'name', allowed: 'a'.repeat(80), oversized: 'a'.repeat(81) },
    {
      field: 'email',
      allowed: `${'a'.repeat(60)}@${'b'.repeat(55)}.com`,
      oversized: `${'a'.repeat(60)}@${'b'.repeat(56)}.com`,
    },
    { field: 'subject', allowed: 's'.repeat(120), oversized: 's'.repeat(121) },
    { field: 'message', allowed: 'm'.repeat(4000), oversized: 'm'.repeat(4001) },
    { field: 'website', allowed: 'w'.repeat(200), oversized: 'w'.repeat(201) },
  ])('accepts $field at its size limit and rejects one extra character', ({ field, allowed, oversized }) => {
    expect(contactSchema.safeParse({ ...valid, [field]: allowed }).success).toBe(true);

    const result = contactSchema.safeParse({ ...valid, [field]: oversized });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: [field], code: 'too_big' }),
    ]));
  });
});
