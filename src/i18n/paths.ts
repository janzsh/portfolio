import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

/** `/` for the default locale, `/es/` for the others. */
export const localePath = (locale: Locale, path = ''): string => {
  const clean = path.replace(/^\/+/, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  return `/${prefix}${clean}`;
};

export const alternates = (path = '') =>
  LOCALES.map((locale) => ({ locale, href: localePath(locale, path) }));
