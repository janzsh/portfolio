import { describe, expect, it } from 'vitest';
import { ui } from '../../../i18n/ui';
import { buildWorkspace, type WorkspaceInput } from './build-workspace';
import { flattenFiles } from './tree';

const input = (over: Partial<WorkspaceInput> = {}): WorkspaceInput => ({
  locale: 'en',
  t: ui('en'),
  now: new Date(2024, 5, 15),
  profile: {
    firstName: 'Ana',
    lastName: 'Ruiz',
    role: 'Software Engineer',
    headline: 'h',
    tagline: 'Builds things end to end.',
    description: 'd',
    aboutTitle: 'About me',
    about: ['First paragraph.', 'Second paragraph.'],
    location: 'Bogotá',
    languages: [],
    workMode: 'Remote',
    timezone: 'UTC−5',
    stats: [],
  },
  experience: [
    {
      id: 'acme',
      company: 'Acme',
      role: 'Engineer',
      mode: 'Remote',
      location: 'Bogotá',
      summary: 'Did things.',
      start: '01/2020',
      end: '03/2022',
      responsibilities: [],
      achievements: ['Cut latency 17%'],
      stack: ['Go'],
    },
  ],
  education: [{ id: 'uni', institution: 'Uni', program: 'Systems', location: 'Santa Marta', start: '08/2019', status: 'In progress', summary: 'Learned.' }],
  projects: [
    {
      id: 'demo',
      name: 'Demo',
      year: '2026',
      type: 'personal',
      summary: 'A demo.',
      skills: ['Go', 'Astro'],
      placeholder: true,
      featured: true,
      order: 1,
      repo: 'https://github.com/x/demo',
      entry: { body: '**Problem.** Something.' },
    } as unknown as WorkspaceInput['projects'][number],
  ],
  groups: [
    { id: 'backend', tier: 'primary', title: 'Backend', description: '', items: [{ name: 'Go', status: 'production', usedIn: [] }] },
    { id: 'misc', tier: 'also', title: 'Also', description: '', items: [{ name: 'Lua', status: 'production', usedIn: [] }] },
  ],
  ...over,
});

describe('buildWorkspace', () => {
  const ws = buildWorkspace(input());
  const files = flattenFiles(ws.root);
  const byId = (id: string) => files.find((f) => f.id === id)!;

  it('lays the content out like a repository and opens the README first', () => {
    expect(ws.root.map((n) => `${n.kind}:${n.id}`)).toEqual(['folder:experience', 'folder:education', 'folder:projects', 'file:README.md']);
    expect(ws.initialFileId).toBe('README.md');
    expect(files.map((f) => f.id)).toContain('projects/demo.md');
  });

  it('opens the experience folder by default', () => {
    expect(ws.root.find((n) => n.id === 'experience')).toMatchObject({ defaultOpen: true });
  });

  it('writes experience as pretty JSON with a formatted period and duration', () => {
    const data = JSON.parse(byId('experience/acme.json').source);
    expect(data).toMatchObject({ company: 'Acme', period: 'Jan 2020 – Mar 2022', duration: '2 yrs 2 mos', impact: ['Cut latency 17%'], stack: ['Go'] });
    expect(byId('experience/acme.json').source).toContain('\n  "company"');
  });

  it('measures an ongoing position up to the injected date', () => {
    const open = buildWorkspace(input({ experience: [{ ...input().experience[0], end: undefined, start: '06/2023' }] }));
    expect(JSON.parse(flattenFiles(open.root).find((f) => f.id === 'experience/acme.json')!.source)).toMatchObject({ period: 'Jun 2023 – Present', duration: '1 yr' });
  });

  it('writes a project as Markdown with its stack, body, links and sample note', () => {
    const md = byId('projects/demo.md').source;
    expect(md).toContain('# Demo');
    expect(md).toContain('`Go` `Astro`');
    expect(md).toContain('**Problem.** Something.');
    expect(md).toContain('https://github.com/x/demo');
    expect(md).toContain(ui('en').ide.sampleNote);
  });

  it('writes the README from the profile and lists only the focus skill groups', () => {
    const md = byId('README.md').source;
    expect(md).toContain('# Ana Ruiz');
    expect(md).toContain('Builds things end to end.');
    expect(md).toContain('- **Backend**: Go');
    expect(md).not.toContain('Lua');
  });

  it('only publishes public profiles as contact: no email address and no phone number', () => {
    const everything = files.map((f) => f.source).join('\n');
    expect(everything).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(everything).not.toMatch(/\+\d[\d ]{8,}/);
    expect(everything).not.toMatch(/mailto:|tel:/);
    expect(byId('README.md').source).toContain('https://github.com/janzsh');
  });
});
