import { z } from 'astro/zod';

export const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  headline: z.string(),
  tagline: z.string(),
  aboutTitle: z.string(),
  about: z.array(z.string()).min(1),
  location: z.string(),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
  workMode: z.string(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
});
export type Profile = z.infer<typeof profileSchema>;
