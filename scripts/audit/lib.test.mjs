import { describe, expect, it } from 'vitest';
import { THRESHOLDS, checkScores, staticCandidates, summarize } from './lib.mjs';

const root = '/site';

describe('staticCandidates', () => {
  it('maps a clean URL to the file, the directory index and the .html file, in order', () => {
    expect(staticCandidates(root, '/skills')).toEqual(['/site/skills', '/site/skills/index.html', '/site/skills.html']);
  });

  it('serves the root from its index', () => {
    expect(staticCandidates(root, '/')).toContain('/site/index.html');
  });

  it('ignores the query string and decodes the path', () => {
    expect(staticCandidates(root, '/es/resume?x=1')[0]).toBe('/site/es/resume');
    expect(staticCandidates(root, '/a%20b')[0]).toBe('/site/a b');
  });

  it('refuses to leave the site folder', () => {
    expect(staticCandidates(root, '/../etc/passwd')).toBeNull();
    expect(staticCandidates(root, '/a/../../etc/passwd')).toBeNull();
    expect(staticCandidates(root, '/%2e%2e/secret')).toBeNull();
  });

  it('refuses a malformed escape instead of throwing', () => {
    expect(staticCandidates(root, '/%E0%A4%A')).toBeNull();
  });
});

describe('checkScores', () => {
  const good = { performance: 1, accessibility: 1, 'best-practices': 1, seo: 1, cls: 0 };

  it('passes when every score meets its threshold', () => {
    expect(checkScores(good)).toEqual([]);
  });

  it('requires perfect accessibility and SEO, which are deterministic', () => {
    expect(checkScores({ ...good, accessibility: 0.98 })).toEqual([expect.stringContaining('accessibility')]);
    expect(checkScores({ ...good, seo: 0.99 })).toEqual([expect.stringContaining('seo')]);
  });

  it('tolerates the noise of a shared CI runner in performance', () => {
    expect(checkScores({ ...good, performance: THRESHOLDS.performance })).toEqual([]);
    expect(checkScores({ ...good, performance: THRESHOLDS.performance - 0.01 })).toEqual([expect.stringContaining('performance')]);
  });

  it('fails on layout shift above the good threshold', () => {
    expect(checkScores({ ...good, cls: 0.1 })).toEqual([]);
    expect(checkScores({ ...good, cls: 0.11 })).toEqual([expect.stringContaining('cls')]);
  });

  it('reports every failure, not just the first', () => {
    expect(checkScores({ performance: 0.1, accessibility: 0.5, 'best-practices': 1, seo: 1, cls: 0 })).toHaveLength(2);
  });
});

describe('summarize', () => {
  it('renders a markdown report with one row per run and the verdict', () => {
    const md = summarize({
      lighthouse: [{ label: '/ (mobile)', scores: { performance: 1, accessibility: 1, 'best-practices': 1, seo: 1, cls: 0 }, failures: [] }],
      axe: { runs: 24, violations: [] },
    });
    expect(md).toContain('| / (mobile) | 100 | 100 | 100 | 100 | 0 |');
    expect(md).toContain('24 runs');
    expect(md).toContain('No violations');
  });

  it('lists each axe violation with where it happened', () => {
    const md = summarize({
      lighthouse: [],
      axe: { runs: 1, violations: [{ where: '/ light desktop', id: 'color-contrast', impact: 'serious', nodes: 2, target: '.hero__meta' }] },
    });
    expect(md).toContain('color-contrast');
    expect(md).toContain('/ light desktop');
    expect(md).toContain('.hero__meta');
  });

  it('lists Lighthouse failures', () => {
    const md = summarize({
      lighthouse: [{ label: '/ (mobile)', scores: { performance: 0.5, accessibility: 1, 'best-practices': 1, seo: 1, cls: 0 }, failures: ['performance 50 < 90'] }],
      axe: { runs: 1, violations: [] },
    });
    expect(md).toContain('performance 50 < 90');
  });
});
