import { describe, expect, it } from 'vitest';
import { robotsTxt } from './robots';

describe('robotsTxt', () => {
  it('allows everything and links the sitemap index on the site origin', () => {
    expect(robotsTxt('https://janz.dev')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://janz.dev/sitemap-index.xml\n',
    );
  });
});
