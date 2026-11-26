import { describe, expect, it } from 'vitest';
import { resumeData, type ResumeDataInput } from './resume-data';

const input: ResumeDataInput = {
  locale: 'en',
  presentLabel: 'Present',
  statusLabels: { production: 'In production', 'hands-on': 'In projects', learning: 'Learning' },
  links: { website: 'https://ada.dev', github: 'https://github.com/ada', linkedin: 'https://www.linkedin.com/in/ada' },
  profile: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    role: 'Backend Developer',
    headline: 'I build engines.',
    tagline: 'Services that keep running.',
    stackLine: 'Go · SQL',
    description: 'Backend developer.',
    aboutTitle: 'About',
    about: ['I like engines.'],
    location: 'London, UK',
    languages: [{ name: 'French', level: 'B1', detail: 'reading and writing' }],
    workMode: 'Remote',
    timezone: 'UTC',
    stats: [{ value: '5+', label: 'years' }],
  },
  experience: [
    {
      id: 'acme',
      company: 'Acme',
      role: 'Engineer',
      mode: 'Remote',
      location: 'London',
      summary: 'Ran the data platform.',
      start: '01/2020',
      responsibilities: ['Development'],
      achievements: ['Cut batch time from 4 hours to 1.', 'Halved memory use.'],
      stack: ['Go'],
    },
  ],
  education: [{ institution: 'Uni', program: 'Mathematics', location: 'London', start: '09/2015', status: 'Finished', summary: 'Analysis.' }],
  projects: [
    { name: 'Engine', year: '2024', type: 'personal', kind: 'backend', summary: 'An engine.', skills: ['Go'], repo: 'https://github.com/ada/engine', body: '**Problem.** Slow sums.' },
  ],
  groups: [
    {
      id: 'backend',
      tier: 'primary',
      title: 'Backend',
      description: 'Services.',
      items: [{ name: 'Go', status: 'hands-on', since: 'Jan 2024', usedIn: [{ label: 'Engine', href: '/projects' }] }],
    },
  ],
};

describe('resumeData', () => {
  const data = resumeData(input, new Date(2024, 5, 15));

  it('keeps every achievement of a role with its formatted period', () => {
    expect(data.experience[0]).toMatchObject({
      company: 'Acme',
      period: 'Jan 2020 – Present',
      achievements: ['Cut batch time from 4 hours to 1.', 'Halved memory use.'],
    });
  });

  it('keeps how far each technology goes and where it was used, by name', () => {
    expect(data.skills[0].technologies[0]).toEqual({ name: 'Go', status: 'In projects', since: 'Jan 2024', usedIn: ['Engine'] });
  });

  it('publishes only the project fields a résumé needs, not internal ones', () => {
    const project = { ...input.projects[0], score: 80, searchSkills: ['Go'] };
    expect(resumeData({ ...input, projects: [project] }).projects[0]).toEqual({
      name: 'Engine',
      year: '2024',
      type: 'personal',
      kind: 'backend',
      summary: 'An engine.',
      skills: ['Go'],
      repo: 'https://github.com/ada/engine',
      caseStudy: '**Problem.** Slow sums.',
    });
  });

  it('carries the full case study of each project', () => {
    expect(data.projects[0]).toMatchObject({ name: 'Engine', repo: 'https://github.com/ada/engine', caseStudy: '**Problem.** Slow sums.' });
  });

  it('describes the person with public links only, and what each language level covers', () => {
    expect(data).toMatchObject({
      name: 'Ada Lovelace',
      role: 'Backend Developer',
      summary: 'Services that keep running.',
      links: { website: 'https://ada.dev', github: 'https://github.com/ada', linkedin: 'https://www.linkedin.com/in/ada' },
      languages: [{ name: 'French', level: 'B1', detail: 'reading and writing' }],
    });
  });
});
