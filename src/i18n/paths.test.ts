import { describe, expect, it } from 'vitest';
import { alternates, localePath } from './paths';

describe('localePath', () => {
  it('serves the default locale from the root and the others under their prefix', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('es')).toBe('/es/');
    expect(localePath('en', 'projects')).toBe('/projects');
    expect(localePath('es', '/projects')).toBe('/es/projects');
  });
});

describe('alternates', () => {
  it('lists the same page in every locale', () => {
    expect(alternates('skills')).toEqual([
      { locale: 'en', href: '/skills' },
      { locale: 'es', href: '/es/skills' },
    ]);
  });
});
