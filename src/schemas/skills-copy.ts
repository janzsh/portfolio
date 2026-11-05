import { z } from 'astro/zod';

export const skillsCopySchema = z.object({
  groups: z.record(z.string(), z.object({ title: z.string(), description: z.string() })),
  heading: z.object({ lead: z.string(), direction: z.string(), directionLead: z.string(), directionItems: z.array(z.string()) }),
});
export type SkillsCopy = z.infer<typeof skillsCopySchema>;
