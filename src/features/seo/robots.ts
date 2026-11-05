export const robotsTxt = (siteUrl: string): string =>
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', siteUrl).href}\n`;
