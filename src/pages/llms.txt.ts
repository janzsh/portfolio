import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getExperience, getProfile, getProjects, getStack } from '../data/queries';
import { stackByStatus } from '../domain/skills';
import { toExperienceView } from '../features/experience/to-view';
import { llmsTxt } from '../features/seo/llms';
import { ui } from '../i18n/ui';

export const GET: APIRoute = async () => {
  const [profile, experience, projects, stack] = await Promise.all([getProfile('en'), getExperience('en'), getProjects('en'), getStack()]);
  const present = ui('en').experience.present;
  const body = llmsTxt({
    siteUrl: SITE.url,
    name: SITE.name,
    description: profile.description,
    location: profile.location,
    workMode: profile.workMode,
    languages: profile.languages,
    stack: stackByStatus(stack),
    experience: experience.map((entry) => {
      const job = toExperienceView(entry, 'en', present);
      return { role: job.role, company: job.company, period: job.period, summary: job.summary };
    }),
    projects: projects
      .filter((project) => !project.placeholder)
      .map((project) => ({ name: project.name, year: project.year, summary: project.summary, href: project.repo ?? new URL('/projects', SITE.url).href })),
    social: SITE.social,
  });
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
