import { describe, expect, it } from 'vitest';
import { experienceSchema } from './experience';

const valid = {
  company: 'Example Company',
  role: 'Backend Engineer',
  mode: 'Remote',
  location: 'Bogotá, Colombia',
  summary: 'Built and operated delivery services.',
  start: '04/2024',
};

describe('experienceSchema', () => {
  it.each(['04/2024', '21/04/2024'])('accepts an ongoing role starting on %s and defaults its lists', (start) => {
    expect(experienceSchema.parse({ ...valid, start })).toEqual({
      ...valid,
      start,
      responsibilities: [],
      achievements: [],
      stack: [],
    });
  });

  it('preserves a finished role with details and a company URL', () => {
    expect(experienceSchema.parse({
      ...valid,
      end: '30/06/2025',
      responsibilities: ['Maintained the API'],
      achievements: ['Reduced delivery delays'],
      stack: ['Go'],
      url: 'https://example.com',
    })).toMatchObject({
      end: '30/06/2025',
      responsibilities: ['Maintained the API'],
      achievements: ['Reduced delivery delays'],
      stack: ['Go'],
      url: 'https://example.com',
    });
  });

  it.each([
    { field: 'start', value: undefined },
    { field: 'start', value: '2024-04-21' },
    { field: 'end', value: 'Present' },
    { field: 'url', value: 'example.com' },
  ])('rejects invalid $field content ($value)', ({ field, value }) => {
    const result = experienceSchema.safeParse({ ...valid, [field]: value });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });
});
