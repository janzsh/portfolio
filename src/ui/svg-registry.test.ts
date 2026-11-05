import { describe, expect, it } from 'vitest';
import { decoration } from './decorations';
import { svg } from './svg-registry';

describe('svg', () => {
  it('returns the raw markup of an icon or brand mark by file name', () => {
    expect(svg('github')).toContain('<svg');
    expect(svg('logo')).toContain('<svg');
  });

  it('fails loudly on an unknown name instead of rendering nothing', () => {
    expect(() => svg('does-not-exist')).toThrow('Unknown svg asset "does-not-exist"');
  });

  it('keeps icons themable through currentColor', () => {
    expect(svg('github')).toContain('currentColor');
  });
});

describe('decoration', () => {
  it('returns large decorative svgs and rejects unknown ones', () => {
    expect(decoration('hero-decoration')).toContain('<svg');
    expect(() => decoration('nope')).toThrow('Unknown decoration "nope"');
  });
});
