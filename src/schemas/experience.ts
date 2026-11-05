import { z } from 'astro/zod';

const dateString = z.string().regex(/^(\d{2}\/)?\d{2}\/\d{4}$/, 'Use MM/YYYY or DD/MM/YYYY');

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  mode: z.string(),
  location: z.string(),
  summary: z.string(),
  start: dateString,
  end: dateString.optional(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  url: z.url().optional(),
});
export type Experience = z.infer<typeof experienceSchema>;
