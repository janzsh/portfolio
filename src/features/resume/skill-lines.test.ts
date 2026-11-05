import { describe, expect, it } from 'vitest';
import type { SkillGroup } from '../../domain/skills';
import { skillLines } from './skill-lines';

const group = (title: string, names: string[], status: 'production' | 'learning' = 'production'): SkillGroup => ({
  id: title.toLowerCase(),
  tier: 'primary',
  title,
  description: '',
  items: names.map((name) => ({ name, status, usedIn: [] })),
});

describe('skillLines', () => {
  it('lists each group as a title and its comma-separated technologies', () => {
    expect(skillLines([group('Backend', ['Go', 'Java'])], 'learning')).toEqual([{ title: 'Backend', items: 'Go, Java' }]);
  });

  it('flags technologies that are still being learned', () => {
    const groups = [group('Cloud', ['Kubernetes'], 'learning'), group('Cloud 2', ['AWS'])];
    expect(skillLines(groups, 'Learning')[0].items).toBe('Kubernetes (learning)');
  });

  it('skips groups with nothing in them', () => {
    expect(skillLines([group('Empty', [])], 'learning')).toEqual([]);
  });

  it('drops the label of a group that only repeats its own name', () => {
    expect(skillLines([group('Python', ['Python'])], 'learning')).toEqual([{ title: '', items: 'Python' }]);
  });
});
