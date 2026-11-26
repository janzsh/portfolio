// Accessibility and performance audit of the production build, meant for CI:
//   pnpm build && pnpm audit:web
// Serves .vercel/output/static, then runs axe-core over every page (both themes) and a few
// Lighthouse runs. Exits 1 on any axe violation or Lighthouse score below its threshold.
import { appendFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import axe from 'axe-core';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import puppeteer from 'puppeteer-core';
import { checkScores, summarize } from './audit/lib.mjs';
import { serveStatic } from './static-server.mjs';

const ROOT = resolve('.vercel/output/static');
const THEMES = ['light', 'dark'];
const VIEWPORTS = { desktop: { width: 1280, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true } };
const AXE_PAGES = ['/', '/es/', '/skills', '/es/skills', '/projects', '/resume', '/es/resume', '/404.html'];
// Layout differs on small screens, but colors do not, so mobile only needs a sample of pages.
const MOBILE_PAGES = ['/', '/skills', '/resume'];
const LIGHTHOUSE_RUNS = [
  { path: '/', label: '/ (mobile)', desktop: false },
  { path: '/', label: '/ (desktop)', desktop: true },
  { path: '/skills', label: '/skills (mobile)', desktop: false },
];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practices'];

async function axeRun(browser, base, path, theme, viewport, interact) {
  const page = await browser.newPage();
  try {
    await page.setViewport(VIEWPORTS[viewport]);
    await page.evaluateOnNewDocument((value) => {
      try {
        localStorage.setItem('theme', value);
      } catch {}
    }, theme);
    await page.goto(base + path, { waitUntil: 'networkidle0' });
    // Guard: an audit of the wrong theme would pass for the wrong reason.
    const applied = await page.evaluate(() => document.documentElement.dataset.theme);
    if (applied !== theme) throw new Error(`${path}: expected theme "${theme}", page is "${applied ?? 'system'}"`);
    if (interact) await interact(page);

    await page.evaluate(axe.source);
    const { violations } = await page.evaluate((tags) => globalThis.axe.run(document, { runOnly: { type: 'tag', values: tags } }), AXE_TAGS);
    const where = `${path} ${theme} ${viewport}${interact ? ' (IDE in use)' : ''}`;
    return violations.map((v) => ({ where, id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0].target.join(' ') }));
  } finally {
    await page.close();
  }
}

/** Scrolls to the IDE so its island hydrates, then opens a folder and a file. */
async function useIde(page) {
  await page.evaluate(() => document.querySelector('#code').scrollIntoView());
  await page.waitForSelector('astro-island[component-url*="IdeWindow"]:not([ssr])', { timeout: 15000 });
  // Preact repaints asynchronously: wait for each row to exist before clicking it.
  const click = async (name) => {
    await page.waitForFunction((n) => [...document.querySelectorAll('.ide__row')].some((r) => r.textContent.trim().startsWith(n)), { timeout: 5000 }, name);
    await page.evaluate((n) => [...document.querySelectorAll('.ide__row')].find((r) => r.textContent.trim().startsWith(n)).click(), name);
  };
  await click('projects');
  await click('auth-core');
  await page.waitForSelector('.ide__tab--active', { timeout: 5000 });
}

async function runAxe(chromePort, base) {
  const browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chromePort}` });
  const violations = [];
  let runs = 0;
  try {
    for (const theme of THEMES) {
      for (const path of AXE_PAGES) (runs++, violations.push(...(await axeRun(browser, base, path, theme, 'desktop'))));
      for (const path of MOBILE_PAGES) (runs++, violations.push(...(await axeRun(browser, base, path, theme, 'mobile'))));
      runs++;
      violations.push(...(await axeRun(browser, base, '/', theme, 'desktop', useIde)));
    }
  } finally {
    await browser.disconnect();
  }
  return { runs, violations };
}

async function runLighthouse(chromePort, base) {
  const results = [];
  for (const { path, label, desktop } of LIGHTHOUSE_RUNS) {
    const flags = { port: chromePort, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] };
    const { lhr } = await lighthouse(base + path, flags, desktop ? desktopConfig : undefined);
    const scores = {
      performance: lhr.categories.performance.score,
      accessibility: lhr.categories.accessibility.score,
      'best-practices': lhr.categories['best-practices'].score,
      seo: lhr.categories.seo.score,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
    };
    results.push({ label, scores, failures: checkScores(scores) });
  }
  return results;
}

async function main() {
  if (!(await stat(ROOT).catch(() => null))) throw new Error(`No build found at ${ROOT}. Run "pnpm build" first.`);
  const started = Date.now();
  const { server, base } = await serveStatic(ROOT);
  const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  try {
    const axeResult = await runAxe(chrome.port, base);
    console.log(`axe: ${axeResult.runs} runs, ${axeResult.violations.length} violations (${Math.round((Date.now() - started) / 1000)}s)`);
    const lighthouseResult = await runLighthouse(chrome.port, base);
    console.log(`lighthouse: ${lighthouseResult.length} runs (${Math.round((Date.now() - started) / 1000)}s total)`);

    const report = summarize({ lighthouse: lighthouseResult, axe: axeResult });
    console.log('\n' + report);
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, report);
    return axeResult.violations.length === 0 && lighthouseResult.every((run) => run.failures.length === 0) ? 0 : 1;
  } finally {
    await chrome.kill();
    server.close();
  }
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
