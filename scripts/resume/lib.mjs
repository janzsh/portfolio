// Pure helpers for the résumé PDF script (kept apart from the browser code so they can be unit-tested).
import { basename } from 'node:path';
import { z } from 'astro/zod';

/** Where a PDF lands: the public one is served by the site, the private one never leaves this machine. */
export function outputFile(publicPath, isPrivate) {
  return isPrivate ? `private/${basename(publicPath)}` : `public${publicPath}`;
}

const privateEnv = z.object({ RESUME_EMAIL: z.email() });

/** The address only the private résumé carries; the public site never publishes it. */
export function privateEmail(env) {
  const result = privateEnv.safeParse(env);
  if (!result.success) throw new Error('Set RESUME_EMAIL in .env to a valid address to build the private résumé.');
  return result.data.RESUME_EMAIL;
}
