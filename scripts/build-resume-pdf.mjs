// Résumé PDFs from the production build, so recruiters get a file instead of a print dialog:
//   pnpm build && pnpm resume:pdf             public/cv/*.pdf, published with the site (no email)
//   pnpm build && pnpm resume:pdf --private   private/*.pdf with RESUME_EMAIL from .env, never deployed
// Commit the public PDFs after any content change, or the download falls behind the page.
import { mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { launch } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import { SITE } from '../src/config/site.ts';
import { outputFile, privateEmail } from './resume/lib.mjs';
import { serveStatic } from './static-server.mjs';

const ROOT = resolve('.vercel/output/static');
const PAGES = { en: '/resume', es: '/es/resume' };

/** Adds the email as the first contact link. Cloning an existing link keeps Astro's scoped styles. */
function addEmail(email) {
  const list = document.querySelector('.sheet__contact');
  const item = list?.querySelector('li:has(a)')?.cloneNode(true);
  if (!list || !item) throw new Error('The résumé has no contact links to copy.');
  const link = item.querySelector('a');
  link.href = `mailto:${email}`;
  link.textContent = email;
  list.prepend(item);
}

async function main() {
  const isPrivate = process.argv.includes('--private');
  if (isPrivate) {
    try {
      process.loadEnvFile();
    } catch {
      // No .env: privateEmail explains what is missing.
    }
  }
  const email = isPrivate ? privateEmail(process.env) : null;
  if (!(await stat(ROOT).catch(() => null))) throw new Error(`No build found at ${ROOT}. Run "pnpm build" first.`);

  const { server, base } = await serveStatic(ROOT);
  const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
  try {
    for (const [locale, path] of Object.entries(PAGES)) {
      const page = await browser.newPage();
      await page.goto(base + path, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      if (email) await page.evaluate(addEmail, email);
      const file = outputFile(SITE.resumePdf[locale], isPrivate);
      await mkdir(dirname(file), { recursive: true });
      await page.pdf({ path: file, format: 'letter', printBackground: true, preferCSSPageSize: true });
      await page.close();
      console.log(`wrote ${file}`);
    }
  } finally {
    await browser.disconnect();
    chrome.kill();
    server.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
