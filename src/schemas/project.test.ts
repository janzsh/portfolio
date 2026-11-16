import { describe, expect, it } from 'vitest';
import { projectSchema } from './project';

const valid = {
  name: 'Delivery API',
  year: '2026',
  type: 'personal',
  kind: 'backend',
  summary: 'An API for delivery tracking.',
  skills: ['Go', 'PostgreSQL'],
};

describe('projectSchema', () => {
  it('accepts a project without public links and supplies its display defaults', () => {
    expect(projectSchema.parse(valid)).toEqual({
      ...valid,
      featured: false,
      order: 100,
    });
  });

  it('preserves explicit display settings, including an order of zero', () => {
    expect(projectSchema.parse({ ...valid, featured: true, order: 0 })).toMatchObject({
      featured: true,
      order: 0,
    });
  });

  it('accepts absolute image, repository and live URLs', () => {
    expect(projectSchema.safeParse({
      ...valid,
      picture: 'https://example.com/preview.webp',
      repo: 'https://github.com/example/delivery',
      live: 'https://example.com',
    }).success).toBe(true);
  });

  it.each([
    { field: 'type', value: 'unknown' },
    { field: 'kind', value: 'unknown' },
    { field: 'skills', value: [] },
    { field: 'picture', value: '/preview.webp' },
    { field: 'repo', value: 'not a URL' },
    { field: 'live', value: 'example.com' },
    { field: 'order', value: 'first' },
  ])('rejects invalid $field data before it reaches the project list', ({ field, value }) => {
    const result = projectSchema.safeParse({ ...valid, [field]: value });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual([field]);
  });
});
