import { describe, expect, it } from 'vitest';
import { siteJsonLd } from './jsonld';

const graph = (locale: 'en' | 'es' = 'en') =>
  siteJsonLd({ jobTitle: 'Software Engineer', description: 'Builds things.', locale })['@graph'];

describe('siteJsonLd', () => {
  it('describes the person with role, description and profiles', () => {
    const person = graph().find((node) => node['@type'] === 'Person');
    expect(person).toMatchObject({
      name: 'Juan Camilo Zúñiga',
      jobTitle: 'Software Engineer',
      description: 'Builds things.',
    });
    expect(person?.sameAs).toContain('https://github.com/cd-janz');
  });

  it('declares the website in the page locale and points its publisher at the person', () => {
    const nodes = graph('es');
    const person = nodes.find((node) => node['@type'] === 'Person');
    const site = nodes.find((node) => node['@type'] === 'WebSite');
    expect(site).toMatchObject({ url: 'https://janz.dev', inLanguage: 'es' });
    expect(site?.publisher).toEqual({ '@id': person?.['@id'] });
  });
});
