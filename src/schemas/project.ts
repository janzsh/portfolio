import { z } from 'astro/zod';

export const projectSchema = z.object({
  name: z.string(),
  year: z.string(),
  type: z.enum(['personal', 'enterprise', 'test']),
  role: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.string()).min(1),
  picture: z.url().optional(),
  repo: z.url().optional(),
  live: z.url().optional(),
  /** Mock content waiting to be replaced. The UI labels these as samples. */
  placeholder: z.boolean().default(false),
  /** Shown on the home page; everything else lives on /projects. */
  featured: z.boolean().default(false),
  order: z.number().default(100),
});
export type Project = z.infer<typeof projectSchema>;
