import { describe, expect, it } from 'vitest';
import { projectSchema } from './project';

const valid = {
  name: 'Delivery API',
  year: '2026',
  type: 'personal',
  kind: 'backend',
  summary: 'An API for delivery tracking.',
  skills: ['Go', 'PostgreSQL'],
  score: 70,
};

describe('projectSchema', () => {
  it('accepts a project without public links', () => {
    expect(projectSchema.parse(valid)).toEqual(valid);
  });

  it('accepts the edges of the score range', () => {
    expect(projectSchema.safeParse({ ...valid, score: 0 }).success).toBe(true);
    expect(projectSchema.safeParse({ ...valid, score: 100 }).success).toBe(true);
  });

  it('accepts absolute repository and live URLs', () => {
    expect(projectSchema.safeParse({
      ...valid,
      repo: 'https://github.com/example/delivery',
      live: 'https://example.com',
    }).success).toBe(true);
  });

  it.each([
    { field: 'type', value: 'unknown' },
    { field: 'kind', value: 'unknown' },
    { field: 'skills', value: [] },
    { field: 'repo', value: 'not a URL' },
    { field: 'live', value: 'example.com' },
    { field: 'score', value: undefined },
    { field: 'score', value: -1 },
    { field: 'score', value: 101 },
    { field: 'score', value: 7.5 },
    { field: 'score', value: 'high' },
  ])('rejects invalid $field data ($value) before it reaches the project list', ({ field, value }) => {
    const result = projectSchema.safeParse({ ...valid, [field]: value });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });
});
