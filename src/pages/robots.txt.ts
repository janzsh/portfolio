import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { robotsTxt } from '../features/seo/robots';

export const GET: APIRoute = () => new Response(robotsTxt(SITE.url), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
