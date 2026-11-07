import type { TechStatus } from '../../schemas/stack';

export interface LlmsInput {
  siteUrl: string;
  name: string;
  description: string;
  location: string;
  workMode: string;
  languages: { name: string; level: string }[];
  stack: Record<TechStatus, string[]>;
  experience: { role: string; company: string; period: string; summary: string }[];
  /** Real work only: the caller leaves sample projects out. */
  projects: { name: string; year: string; summary: string; href: string }[];
  social: { github: string; linkedin: string };
}

const STATUS_LABEL: Record<TechStatus, string> = { production: 'In production', 'hands-on': 'Hands-on', learning: 'Learning' };

/** Plain-text profile for language models, following the llmstxt.org layout. */
export function llmsTxt(input: LlmsInput): string {
  const url = (path: string) => new URL(path, input.siteUrl).href;
  const stack = (Object.keys(STATUS_LABEL) as TechStatus[])
    .filter((status) => input.stack[status].length > 0)
    .map((status) => `- ${STATUS_LABEL[status]}: ${input.stack[status].join(', ')}`);

  return [
    `# ${input.name}`,
    `> ${input.description}`,
    `Based in ${input.location}. Work mode: ${input.workMode}. Languages: ${input.languages.map((language) => `${language.name} (${language.level})`).join(', ')}.`,
    ['## Stack', ...stack].join('\n'),
    ['## Experience', ...input.experience.map((job) => `- ${job.role}, ${job.company} (${job.period}): ${job.summary}`)].join('\n'),
    ['## Projects', ...input.projects.map((project) => `- [${project.name}](${project.href}) (${project.year}): ${project.summary}`)].join('\n'),
    [
      '## Links',
      `- Website (English): ${url('/')}`,
      `- Website (Español): ${url('/es/')}`,
      `- Résumé: ${url('/resume')}`,
      `- GitHub: ${input.social.github}`,
      `- LinkedIn: ${input.social.linkedin}`,
      `- Contact: ${url('/#contact')} (the form is the way to write; no email is published on purpose)`,
    ].join('\n'),
  ].join('\n\n') + '\n';
}
