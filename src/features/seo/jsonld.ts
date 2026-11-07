import { SITE } from '../../config/site';
import type { Locale } from '../../i18n/locales';

interface Input {
  jobTitle: string;
  description: string;
  locale: Locale;
  knowsAbout: string[];
  knowsLanguage: string[];
  location: string;
}

const personId = `${SITE.url}/#person`;

/**
 * One graph per page: the person this portfolio is about and the website that presents them.
 * Email and phone are deliberately left out: structured data is machine-readable, so it would
 * hand them straight to scrapers and spam bots.
 */
export const siteJsonLd = ({ jobTitle, description, locale, knowsAbout, knowsLanguage, location }: Input) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: SITE.name,
      jobTitle,
      description,
      url: SITE.url,
      sameAs: [SITE.social.github, SITE.social.linkedin],
      knowsAbout,
      knowsLanguage,
      homeLocation: { '@type': 'Place', name: location },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: locale,
      publisher: { '@id': personId },
    },
  ],
});
