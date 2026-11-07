import { describe, expect, it } from 'vitest';
import { siteJsonLd } from './jsonld';

const graph = (locale: 'en' | 'es' = 'en') =>
  siteJsonLd({
    jobTitle: 'Software Engineer',
    description: 'Builds things.',
    locale,
    knowsAbout: ['Python', 'Go'],
    knowsLanguage: ['Spanish', 'English'],
    location: 'Santa Marta, Colombia',
  })['@graph'];

describe('siteJsonLd', () => {
  it('describes the person with role, description and profiles', () => {
    const person = graph().find((node) => node['@type'] === 'Person');
    expect(person).toMatchObject({
      name: 'Juan Camilo Zúñiga',
      jobTitle: 'Software Engineer',
      description: 'Builds things.',
    });
    expect(person?.sameAs).toContain('https://github.com/janzsh');
  });

  it('lists what the person knows, the languages they speak and where they are based', () => {
    const person = graph().find((node) => node['@type'] === 'Person');
    expect(person).toMatchObject({
      knowsAbout: ['Python', 'Go'],
      knowsLanguage: ['Spanish', 'English'],
      homeLocation: { '@type': 'Place', name: 'Santa Marta, Colombia' },
    });
  });

  it('does not publish contact details that spam bots could harvest', () => {
    const person = graph().find((node) => node['@type'] === 'Person');
    expect(person).not.toHaveProperty('email');
    expect(person).not.toHaveProperty('telephone');
  });

  it('declares the website in the page locale and points its publisher at the person', () => {
    const nodes = graph('es');
    const person = nodes.find((node) => node['@type'] === 'Person');
    const site = nodes.find((node) => node['@type'] === 'WebSite');
    expect(site).toMatchObject({ url: 'https://janz.dev', inLanguage: 'es' });
    expect(site?.publisher).toEqual({ '@id': person?.['@id'] });
  });
});
