import { afterEach, describe, expect, it, vi } from 'vitest';
import { initTheme, nextTheme, readStoredTheme, resolveTheme, storeTheme, THEME_KEY } from './theme';

const storage = (initial: Record<string, string> = {}) => {
  const data = { ...initial };
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => void (data[key] = value),
    data,
  };
};
const throwing = () => ({
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
});

describe('stored theme', () => {
  it('reads only valid choices', () => {
    expect(readStoredTheme(storage({ [THEME_KEY]: 'dark' }))).toBe('dark');
    expect(readStoredTheme(storage({ [THEME_KEY]: 'light' }))).toBe('light');
    expect(readStoredTheme(storage({ [THEME_KEY]: 'purple' }))).toBeNull();
    expect(readStoredTheme(storage())).toBeNull();
  });

  it('survives storage being blocked', () => {
    expect(readStoredTheme(throwing())).toBeNull();
    expect(() => storeTheme(throwing(), 'dark')).not.toThrow();
  });

  it('persists a choice under the shared key', () => {
    const s = storage();
    storeTheme(s, 'light');
    expect(s.data[THEME_KEY]).toBe('light');
  });
});

describe('resolveTheme', () => {
  it('prefers the stored choice over the OS preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('falls back to the OS preference', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
});

describe('nextTheme', () => {
  it('flips between light and dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});

describe('initTheme (the inline head script)', () => {
  afterEach(() => vi.unstubAllGlobals());

  const run = (store: unknown) => {
    const root = { dataset: {} as Record<string, string> };
    vi.stubGlobal('localStorage', store);
    vi.stubGlobal('document', { documentElement: root });
    initTheme(THEME_KEY);
    return root.dataset;
  };

  it('applies a stored choice before paint', () => {
    expect(run(storage({ [THEME_KEY]: 'dark' }))).toEqual({ theme: 'dark' });
  });

  it('leaves the OS preference in charge when nothing valid is stored', () => {
    expect(run(storage())).toEqual({});
    expect(run(storage({ [THEME_KEY]: 'nope' }))).toEqual({});
  });

  it('does not throw when storage is blocked', () => {
    expect(run(throwing())).toEqual({});
  });
});
