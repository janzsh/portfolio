import { z } from 'astro/zod';
import { PROJECT_KINDS, PROJECT_TYPES } from '../domain/project-facets';

export const projectSchema = z.object({
  name: z.string(),
  year: z.string(),
  type: z.enum(PROJECT_TYPES),
  /** What the project is made of, as opposed to who it was for. */
  kind: z.enum(PROJECT_KINDS),
  role: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.string()).min(1),
  repo: z.url().optional(),
  live: z.url().optional(),
  /** Hidden ranking, higher is better: sorts every list and picks what the home page shows. */
  score: z.int().min(0).max(100),
});
export type Project = z.infer<typeof projectSchema>;
