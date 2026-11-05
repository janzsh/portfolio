import { SITE } from '../../config/site';
import type { Locale } from '../../i18n/locales';

interface Input {
  jobTitle: string;
  description: string;
  locale: Locale;
}

const personId = `${SITE.url}/#person`;

/** One graph per page: the person this portfolio is about and the website that presents them. */
export const siteJsonLd = ({ jobTitle, description, locale }: Input) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: SITE.name,
      jobTitle,
      description,
      url: SITE.url,
      email: SITE.email,
      telephone: SITE.phone.display,
      sameAs: [SITE.social.github, SITE.social.linkedin],
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
