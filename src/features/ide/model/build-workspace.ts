import { SITE } from '../../../config/site';
import type { ProjectItem } from '../../../data/queries';
import type { SkillGroup } from '../../../domain/skills';
import type { Locale } from '../../../i18n/locales';
import type { UiStrings } from '../../../i18n/ui';
import type { Education } from '../../../schemas/education';
import type { Experience } from '../../../schemas/experience';
import type { Profile } from '../../../schemas/profile';
import { formatMonthYear } from '../../../domain/dates';
import { toExperienceView } from '../../experience/to-view';
import type { IdeFile, IdeFolder, Workspace } from './types';

export interface WorkspaceInput {
  locale: Locale;
  t: UiStrings;
  profile: Profile;
  experience: (Experience & { id: string })[];
  education: (Education & { id: string })[];
  projects: ProjectItem[];
  groups: SkillGroup[];
  /** "Today", injected so durations of ongoing positions are deterministic under test. */
  now?: Date;
}

const jsonFile = (folder: string, id: string, content: Record<string, unknown>): IdeFile => ({
  kind: 'file',
  id: `${folder}/${id}.json`,
  name: `${id}.json`,
  language: 'json',
  icon: 'braces',
  source: JSON.stringify(content, null, 2),
});

const markdownFile = (id: string, source: string): IdeFile => ({
  kind: 'file',
  id,
  name: id.split('/').pop()!,
  language: 'markdown',
  icon: 'markdown',
  source,
});

const folder = (name: string, children: IdeFile[], defaultOpen = false): IdeFolder => ({ kind: 'folder', id: name, name, children, defaultOpen });

/** Turns portfolio content into a virtual repository. Pure: same input, same output. */
export function buildWorkspace({ locale, t, profile, experience, education, projects, groups, now = new Date() }: WorkspaceInput): Workspace {
  const experienceFiles = experience.map((entry) => {
    const job = toExperienceView(entry, locale, t.experience.present, now);
    return jsonFile('experience', job.id, {
      company: job.company,
      role: job.role,
      period: job.period,
      duration: job.duration,
      location: `${job.location} (${job.mode})`,
      summary: job.summary,
      impact: job.achievements,
      stack: job.stack,
    });
  });

  const educationFiles = education.map((item) =>
    jsonFile('education', item.id, {
      institution: item.institution,
      program: item.program,
      since: formatMonthYear(item.start, locale),
      status: item.status,
      location: item.location,
      summary: item.summary,
    }),
  );

  const projectFiles = projects.map((project) =>
    markdownFile(
      `projects/${project.id}.md`,
      [
        `# ${project.name}`,
        `> ${[project.year, project.type, project.role].filter(Boolean).join(' · ')}${project.placeholder ? ` — ${t.ide.sampleNote}` : ''}`,
        '',
        project.summary,
        '',
        '## Stack',
        project.skills.map((skill) => `\`${skill}\``).join(' '),
        '',
        ...(project.entry.body ?? '').split('\n'),
        ...(project.repo ? ['', `- ${project.repo}`] : []),
        ...(project.live ? [`- ${project.live}`] : []),
      ].join('\n'),
    ),
  );

  // Public profiles only: an email or phone here would be harvested like anywhere else in the HTML.
  const readme = markdownFile(
    'README.md',
    [
      `# ${profile.firstName} ${profile.lastName}`,
      `> ${profile.role} · ${profile.location}`,
      '',
      profile.tagline,
      '',
      `## ${profile.aboutTitle}`,
      ...profile.about.flatMap((paragraph) => [paragraph, '']),
      `## ${t.sections.skills}`,
      ...groups.filter((group) => group.tier !== 'also').map((group) => `- **${group.title}**: ${group.items.map((item) => item.name).join(', ')}`),
      '',
      `## ${t.sections.contact}`,
      `- ${SITE.social.linkedin}`,
      `- ${SITE.social.github}`,
    ].join('\n'),
  );

  return {
    name: SITE.handle,
    root: [folder('experience', experienceFiles, true), folder('education', educationFiles), folder('projects', projectFiles), readme],
    initialFileId: readme.id,
  };
}
