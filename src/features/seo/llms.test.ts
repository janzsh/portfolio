import { describe, expect, it } from 'vitest';
import { llmsTxt, type LlmsInput } from './llms';

const input: LlmsInput = {
  siteUrl: 'https://janz.dev',
  name: 'Ada Lovelace',
  description: 'Builds reliable services.',
  location: 'London, UK',
  workMode: 'Remote',
  languages: [{ name: 'English', level: 'Native' }],
  stack: { production: ['Python', 'SQL'], 'hands-on': ['Go'], learning: [] },
  experience: [{ role: 'Engineer', company: 'Acme', period: 'Jan 2020 – Present', summary: 'Ran the data platform.' }],
  projects: [{ name: 'Engine', year: '2024', summary: 'An analytical engine.', href: 'https://github.com/ada/engine' }],
  social: { github: 'https://github.com/ada', linkedin: 'https://www.linkedin.com/in/ada' },
};

describe('llmsTxt', () => {
  const text = llmsTxt(input);

  it('opens with the name and the description as a one-line summary, as the llms.txt format asks', () => {
    expect(text.startsWith('# Ada Lovelace\n\n> Builds reliable services.\n')).toBe(true);
  });
  it('states where they are, how they work and which languages they speak', () => {
    expect(text).toContain('London, UK');
    expect(text).toContain('Remote');
    expect(text).toContain('English (Native)');
  });
  it('lists the stack by status and skips empty ones', () => {
    expect(text).toContain('- In production: Python, SQL');
    expect(text).toContain('- Hands-on: Go');
    expect(text).not.toContain('Learning');
  });
  it('lists experience and projects with their summaries', () => {
    expect(text).toContain('- Engineer, Acme (Jan 2020 – Present): Ran the data platform.');
    expect(text).toContain('- [Engine](https://github.com/ada/engine) (2024): An analytical engine.');
  });
  it('points to both language versions and the profiles, and says why there is no email', () => {
    expect(text).toContain('https://janz.dev/es/');
    expect(text).toContain('https://github.com/ada');
    expect(text).toMatch(/email/i);
  });
});
