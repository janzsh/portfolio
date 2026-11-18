import { describe, expect, it } from 'vitest';
import { stackSchema } from './stack';

const valid = {
  groups: [{ id: 'backend', tier: 'primary' }],
  technologies: [{ name: 'Go', group: 'backend', status: 'production' }],
};

describe('stackSchema', () => {
  it('defaults a technology to no evidence references', () => {
    expect(stackSchema.parse(valid)).toEqual({
      groups: [{ id: 'backend', tier: 'primary' }],
      technologies: [{ name: 'Go', group: 'backend', status: 'production', usedIn: [] }],
    });
  });

  it('requires every technology to state its status, so none is claimed as production by omission', () => {
    const result = stackSchema.safeParse({ ...valid, technologies: [{ name: 'Go', group: 'backend' }] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['technologies', 0, 'status']);
  });

  it('accepts multiple groups and framework languages with both evidence sources', () => {
    const technology = {
      name: 'Spring Boot',
      group: ['backend', 'platform'],
      since: '06/2024',
      category: 'framework',
      language: ['Java', 'Kotlin'],
      status: 'hands-on',
      usedIn: ['project:delivery-api', 'experience:example-company'],
    };

    expect(stackSchema.parse({
      groups: [{ id: 'backend', tier: 'primary' }, { id: 'platform', tier: 'secondary' }],
      technologies: [technology],
    }).technologies).toEqual([technology]);
  });

  it('rejects unknown group tiers', () => {
    const result = stackSchema.safeParse({ ...valid, groups: [{ id: 'backend', tier: 'expert' }] });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['groups', 0, 'tier']);
  });

  it.each([
    { field: 'group', value: [] },
    { field: 'language', value: [] },
    { field: 'category', value: 'database' },
    { field: 'status', value: 'expert' },
    { field: 'since', value: '2024-06' },
    { field: 'usedIn', value: ['delivery-api'] },
    { field: 'usedIn', value: ['project:'] },
    { field: 'usedIn', value: ['education:example'] },
    { field: 'usedIn', value: ['project:Invalid Reference'] },
  ])('rejects invalid technology $field data ($value)', ({ field, value }) => {
    const result = stackSchema.safeParse({
      ...valid,
      technologies: [{ name: 'Go', group: 'backend', status: 'production', [field]: value }],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path.slice(0, 3)).toEqual(['technologies', 0, field]);
  });
});
