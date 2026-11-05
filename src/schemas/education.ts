import { z } from 'astro/zod';

export const educationSchema = z.object({
  institution: z.string(),
  program: z.string(),
  location: z.string(),
  start: z.string(),
  status: z.string(),
  summary: z.string(),
});
export type Education = z.infer<typeof educationSchema>;
