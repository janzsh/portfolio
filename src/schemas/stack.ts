import { z } from 'astro/zod';

export const TIERS = ['primary', 'secondary', 'tertiary', 'growing', 'also'] as const;
export const STATUSES = ['production', 'hands-on', 'learning'] as const;

const dateString = z.string().regex(/^\d{2}\/\d{4}$/, 'Use MM/YYYY');
/** `project:<id>` or `experience:<id>`; resolved to a display name and link at build time. */
const evidenceRef = z.string().regex(/^(project|experience):[a-z0-9-]+$/);

export const technologySchema = z.object({
  name: z.string(),
  group: z.string(),
  since: dateString.optional(),
  /** production = shipped at work; hands-on = built in projects; learning = in progress. */
  status: z.enum(STATUSES).default('production'),
  usedIn: z.array(evidenceRef).default([]),
});

export const stackSchema = z.object({
  /** Order here is the priority order shown everywhere. */
  groups: z.array(z.object({ id: z.string(), tier: z.enum(TIERS) })),
  technologies: z.array(technologySchema),
});

export type Technology = z.infer<typeof technologySchema>;
export type Stack = z.infer<typeof stackSchema>;
export type Tier = (typeof TIERS)[number];
export type TechStatus = (typeof STATUSES)[number];
