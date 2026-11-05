import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { educationSchema } from './schemas/education';
import { experienceSchema } from './schemas/experience';
import { profileSchema } from './schemas/profile';
import { projectSchema } from './schemas/project';
import { skillsCopySchema } from './schemas/skills-copy';
import { stackSchema } from './schemas/stack';

// Content is organised as `<collection>/<locale>/<entry>`; the entry id carries the locale.
const profile = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/profile' }),
  schema: profileSchema,
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experience' }),
  schema: experienceSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/education' }),
  schema: educationSchema,
});

// Technologies are language-neutral facts; their group copy is localized.
const stack = defineCollection({
  loader: glob({ pattern: 'stack.json', base: './src/content/stack' }),
  schema: stackSchema,
});

const skills = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/skills' }),
  schema: skillsCopySchema,
});

export const collections = { profile, experience, projects, education, stack, skills };
