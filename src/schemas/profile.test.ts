import { describe, expect, it } from 'vitest';
import { profileSchema } from './profile';

const valid = {
  firstName: 'Ana',
  lastName: 'Torres',
  role: 'Backend Engineer',
  headline: 'I build services.',
  tagline: 'Reliable systems for real teams.',
  stackLine: 'Go · SQL',
  description: 'Backend engineer building reliable services.',
  aboutTitle: 'About me',
  about: ['I build and operate web services.'],
  location: 'Bogotá, Colombia',
  languages: [{ name: 'Spanish', level: 'Native' }],
  workMode: 'Remote',
  timezone: 'UTC−5',
  stats: [{ value: '5', label: 'years of experience' }],
};

describe('profileSchema', () => {
  it('accepts a complete profile for page and SEO rendering', () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it('keeps an optional detail of what a language level covers', () => {
    const languages = [{ name: 'English', level: 'B1', detail: 'Reading, writing and simple conversations' }];
    expect(profileSchema.parse({ ...valid, languages }).languages).toEqual(languages);
  });

  it('accepts a 160-character SEO description and rejects a longer one', () => {
    expect(profileSchema.safeParse({ ...valid, description: 'a'.repeat(160) }).success).toBe(true);
    expect(profileSchema.safeParse({ ...valid, description: 'a'.repeat(161) }).success).toBe(false);
  });

  it.each([
    { field: 'role', value: undefined },
    { field: 'about', value: [] },
    { field: 'languages', value: [{ name: 'Spanish' }] },
    { field: 'stats', value: [{ value: '5' }] },
  ])('rejects incomplete $field content', ({ field, value }) => {
    const result = profileSchema.safeParse({ ...valid, [field]: value });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe(field);
  });
});
