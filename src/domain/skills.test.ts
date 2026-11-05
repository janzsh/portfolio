import { describe, expect, it } from 'vitest';
import type { SkillsCopy } from '../schemas/skills-copy';
import type { Stack } from '../schemas/stack';
import { buildSkillGroups } from './skills';

const stack: Stack = {
  groups: [{ id: 'go', tier: 'primary' }, { id: 'cloud', tier: 'growing' }],
  technologies: [
    { name: 'Go', group: 'go', since: '01/2024', status: 'hands-on', usedIn: ['project:x', 'project:ghost'] },
    { name: 'Kubernetes', group: 'cloud', status: 'learning', usedIn: [] },
  ],
};
const copy: SkillsCopy = {
  groups: { go: { title: 'Go', description: 'd1' }, cloud: { title: 'Cloud', description: 'd2' } },
  heading: { lead: '', direction: '', directionLead: '', directionItems: [] },
};
const resolve = (ref: string) => (ref === 'project:x' ? { label: 'X', href: '/projects' } : undefined);

describe('buildSkillGroups', () => {
  it('keeps the priority order of the stack file', () => {
    expect(buildSkillGroups(stack, copy, resolve, 'en').map((g) => g.id)).toEqual(['go', 'cloud']);
  });
  it('formats "since" per locale and omits it when unknown', () => {
    const [go, cloud] = buildSkillGroups(stack, copy, resolve, 'es');
    expect(go.items[0].since).toMatch(/2024/);
    expect(cloud.items[0].since).toBeUndefined();
  });
  it('drops evidence that cannot be resolved instead of showing dead links', () => {
    const [go] = buildSkillGroups(stack, copy, resolve, 'en');
    expect(go.items[0].usedIn).toEqual([{ label: 'X', href: '/projects' }]);
  });
  it('fails loudly when a group has no copy for the locale', () => {
    expect(() => buildSkillGroups(stack, { ...copy, groups: {} }, resolve, 'en')).toThrow(/Missing skills copy/);
  });
});
