import type { SkillGroup } from '../../domain/skills';
import type { Locale } from '../../i18n/locales';
import type { Education } from '../../schemas/education';
import type { Profile } from '../../schemas/profile';
import type { Project } from '../../schemas/project';
import type { TechStatus } from '../../schemas/stack';
import { toExperienceView, type ExperienceEntry } from '../experience/to-view';

export type ResumeProject = Pick<Project, 'name' | 'year' | 'type' | 'kind' | 'role' | 'summary' | 'skills' | 'repo' | 'live'> & { body: string };

export interface ResumeDataInput {
  locale: Locale;
  presentLabel: string;
  statusLabels: Record<TechStatus, string>;
  links: { website: string; github: string; linkedin: string };
  profile: Profile;
  experience: ExperienceEntry[];
  education: Education[];
  projects: ResumeProject[];
  groups: SkillGroup[];
}

/**
 * Everything a tailored résumé may draw from, as plain data. Pure.
 * No email or phone: this file is public, contact details live with whoever builds the résumé.
 */
export function resumeData(input: ResumeDataInput, now: Date = new Date()) {
  const { profile } = input;
  return {
    name: `${profile.firstName} ${profile.lastName}`,
    role: profile.role,
    summary: profile.tagline,
    about: profile.about,
    location: profile.location,
    workMode: profile.workMode,
    timezone: profile.timezone,
    languages: profile.languages,
    highlights: profile.stats,
    links: input.links,
    experience: input.experience.map((entry) => {
      const job = toExperienceView(entry, input.locale, input.presentLabel, now);
      return {
        role: job.role,
        company: job.company,
        url: job.url,
        location: job.location,
        mode: job.mode,
        period: job.period,
        duration: job.duration,
        summary: job.summary,
        responsibilities: job.responsibilities,
        achievements: job.achievements,
        stack: job.stack,
      };
    }),
    projects: input.projects.map((project) => ({
      name: project.name,
      year: project.year,
      type: project.type,
      kind: project.kind,
      role: project.role,
      summary: project.summary,
      skills: project.skills,
      repo: project.repo,
      live: project.live,
      caseStudy: project.body,
    })),
    education: input.education.map(({ institution, program, location, start, status, summary }) => ({ institution, program, location, start, status, summary })),
    skills: input.groups.map((group) => ({
      group: group.title,
      description: group.description,
      technologies: group.items.map((item) => ({
        name: item.name,
        status: input.statusLabels[item.status],
        since: item.since,
        usedIn: item.usedIn.map((evidence) => evidence.label),
      })),
    })),
  };
}
