import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getEducation, getExperience, getProfile, getProjects, getSkills } from '../data/queries';
import { resumeData } from '../features/resume/resume-data';
import { LOCALES, type Locale } from '../i18n/locales';
import { ui } from '../i18n/ui';

/** Source data for résumés tailored outside this site, regenerated on every deploy. */
async function forLocale(locale: Locale) {
  const [profile, experience, education, projects, skills] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getEducation(locale),
    getProjects(locale),
    getSkills(locale),
  ]);
  const t = ui(locale);
  return resumeData({
    locale,
    presentLabel: t.experience.present,
    statusLabels: { production: t.skills.production, 'hands-on': t.skills.handsOn, learning: t.skills.learning },
    links: { website: SITE.url, github: SITE.social.github, linkedin: SITE.social.linkedin },
    profile,
    experience,
    education,
    projects: projects.map((project) => ({ ...project, body: project.entry.body ?? '' })),
    groups: skills.groups,
  });
}

export const GET: APIRoute = async () => {
  const locales = Object.fromEntries(await Promise.all(LOCALES.map(async (locale) => [locale, await forLocale(locale)])));
  return new Response(JSON.stringify({ site: SITE.url, locales }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
