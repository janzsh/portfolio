export const THEME_KEY = 'theme';

export type Theme = 'light' | 'dark';

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

export const readStoredTheme = (storage: Pick<Storage, 'getItem'>): Theme | null => {
  try {
    const value = storage.getItem(THEME_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
};

export const storeTheme = (storage: Pick<Storage, 'setItem'>, theme: Theme): void => {
  try {
    storage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be blocked (private mode, site data cleared); the theme just won't persist.
  }
};

/** An explicit choice wins; otherwise follow the OS. */
export const resolveTheme = (stored: Theme | null, prefersDark: boolean): Theme =>
  stored ?? (prefersDark ? 'dark' : 'light');

export const nextTheme = (theme: Theme): Theme => (theme === 'dark' ? 'light' : 'dark');

/**
 * Runs blocking in <head> before first paint so there is no flash of the wrong theme.
 * It is serialized into an inline script, so it must stay self-contained: no imports and no
 * references to anything outside its own body.
 */
export function initTheme(key: string): void {
  try {
    const stored = localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored;
  } catch {
    // Storage blocked: leave the OS preference in charge.
  }
}
