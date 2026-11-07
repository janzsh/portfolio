import { describe, expect, it } from 'vitest';
import type { Stack } from '../schemas/stack';
import { buildFilterOptions, matchesProject, setSelection, withImpliedLanguages } from './project-filters';

const stack: Stack = {
  groups: [{ id: 'backend', tier: 'primary' }],
  technologies: [
    { name: 'Go', group: 'backend', category: 'language', status: 'production', usedIn: [] },
    { name: 'TypeScript', group: 'backend', category: 'language', status: 'production', usedIn: [] },
    { name: 'Java', group: 'backend', category: 'language', status: 'production', usedIn: [] },
    { name: 'Gin', group: 'backend', category: 'framework', language: 'Go', status: 'production', usedIn: [] },
    { name: 'NestJS', group: 'backend', category: 'framework', language: 'TypeScript', status: 'production', usedIn: [] },
    { name: 'Spring Boot', group: 'backend', category: 'framework', language: ['Java', 'Kotlin'], status: 'production', usedIn: [] },
    { name: 'Docker', group: 'backend', status: 'production', usedIn: [] },
  ],
};

describe('withImpliedLanguages', () => {
  it('adds the language of every framework the project lists', () => {
    expect(withImpliedLanguages(['NestJS', 'Docker'], stack)).toEqual(['NestJS', 'TypeScript', 'Docker']);
  });
  it('does not repeat a language the project already lists', () => {
    expect(withImpliedLanguages(['Go', 'Gin'], stack)).toEqual(['Go', 'Gin']);
  });
  it('keeps skills the stack does not know', () => {
    expect(withImpliedLanguages(['Tailwind'], stack)).toEqual(['Tailwind']);
  });
});

const projects = [
  { searchSkills: ['Go', 'Gin', 'Docker'], type: 'personal', kind: 'backend' },
  { searchSkills: ['NestJS', 'TypeScript', 'Tailwind'], type: 'enterprise', kind: 'fullstack' },
] as const;

describe('buildFilterOptions', () => {
  const options = buildFilterOptions(projects, stack);

  it('lists only languages that some project uses, with only their used frameworks', () => {
    expect(options.languages).toEqual([
      { name: 'Go', frameworks: ['Gin'] },
      { name: 'TypeScript', frameworks: ['NestJS'] },
    ]);
  });
  it('puts everything that is neither language nor framework under other technologies', () => {
    expect(options.others).toEqual(['Docker', 'Tailwind']);
  });
  it('offers only the types and kinds present, in the schema order', () => {
    expect(options.types).toEqual(['personal', 'enterprise']);
    expect(options.kinds).toEqual(['backend', 'fullstack']);
  });
});

describe('matchesProject', () => {
  const [go, nest] = projects;
  it('matches everything when nothing is selected', () => {
    expect(matchesProject(go, {})).toBe(true);
  });
  it('requires every selected group to match', () => {
    expect(matchesProject(go, { language: 'Go', type: 'personal' })).toBe(true);
    expect(matchesProject(go, { language: 'Go', type: 'enterprise' })).toBe(false);
    expect(matchesProject(nest, { framework: 'NestJS', kind: 'backend' })).toBe(false);
  });
  it('matches other technologies by name', () => {
    expect(matchesProject(nest, { tech: 'Tailwind' })).toBe(true);
    expect(matchesProject(go, { tech: 'Tailwind' })).toBe(false);
  });
});

describe('setSelection', () => {
  it('sets a value and clears it when the value is empty', () => {
    expect(setSelection({}, 'type', 'test')).toEqual({ type: 'test' });
    expect(setSelection({ type: 'test' }, 'type', '')).toEqual({});
  });
  it('replaces the value of the same group and keeps the others', () => {
    expect(setSelection({ type: 'test', kind: 'script' }, 'type', 'personal')).toEqual({ type: 'personal', kind: 'script' });
  });
  it('drops the framework when the language changes or is cleared', () => {
    expect(setSelection({ language: 'Go', framework: 'Gin' }, 'language', 'TypeScript')).toEqual({ language: 'TypeScript' });
    expect(setSelection({ language: 'Go', framework: 'Gin' }, 'language', '')).toEqual({});
  });
  it('keeps the framework when it is the framework that changes', () => {
    expect(setSelection({ language: 'Go' }, 'framework', 'Gin')).toEqual({ language: 'Go', framework: 'Gin' });
  });
});
