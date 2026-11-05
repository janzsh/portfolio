export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/** Narrow whatever Astro gives us into a supported locale. */
export const resolveLocale = (value: unknown): Locale =>
  isLocale(value) ? value : DEFAULT_LOCALE;
