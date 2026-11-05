import { z } from 'astro/zod';

/** Form posts send empty optional fields as `null`; normalize them to ''. */
const optionalText = (max: number) =>
  z.string().trim().max(max).nullish().transform((value) => value ?? '');

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  subject: optionalText(120),
  message: z.string().trim().min(10).max(4000),
  /** Honeypot: humans never see this field, so it must stay empty. */
  website: optionalText(200),
});

export type ContactInput = z.infer<typeof contactSchema>;
