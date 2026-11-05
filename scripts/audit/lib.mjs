// Pure helpers for the CI audit (kept apart from the browser code so they can be unit-tested).

/**
 * Lighthouse accessibility and SEO are deterministic, so they must be perfect. Performance and
 * best practices vary with the load of a shared CI runner, so they get a margin. CLS is in layout units.
 */
export const THRESHOLDS = { performance: 0.9, accessibility: 1, 'best-practices': 0.9, seo: 1, cls: 0.1 };

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

/** Candidate files for a URL path inside `root`, or null if the path would leave `root`. */
export function staticCandidates(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;

  const clean = [];
  for (const segment of decoded.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (clean.length === 0) return null;
      clean.pop();
    } else clean.push(segment);
  }

  const base = root.replace(/\/$/, '');
  if (clean.length === 0) return [`${base}/index.html`];
  const path = `${base}/${clean.join('/')}`;
  return [path, `${path}/index.html`, `${path}.html`];
}

/** Human-readable failures; empty when everything meets its threshold. */
export function checkScores(scores, thresholds = THRESHOLDS) {
  const failures = CATEGORIES.filter((name) => scores[name] < thresholds[name]).map(
    (name) => `${name} ${Math.round(scores[name] * 100)} < ${Math.round(thresholds[name] * 100)}`,
  );
  if (scores.cls > thresholds.cls) failures.push(`cls ${+scores.cls.toFixed(3)} > ${thresholds.cls}`);
  return failures;
}

const pct = (score) => Math.round(score * 100);

/** Markdown report, shown in the GitHub Actions run summary. */
export function summarize({ lighthouse, axe }) {
  const lines = ['## Site audit', '', '### Lighthouse', ''];
  if (lighthouse.length === 0) lines.push('_No runs._');
  else {
    lines.push('| Page | Performance | Accessibility | Best practices | SEO | CLS |', '| --- | --- | --- | --- | --- | --- |');
    for (const { label, scores } of lighthouse) {
      lines.push(`| ${label} | ${pct(scores.performance)} | ${pct(scores.accessibility)} | ${pct(scores['best-practices'])} | ${pct(scores.seo)} | ${+scores.cls.toFixed(3)} |`);
    }
    const failed = lighthouse.flatMap(({ label, failures }) => failures.map((failure) => `- **${label}**: ${failure}`));
    if (failed.length) lines.push('', ...failed);
  }

  lines.push('', '### axe-core (WCAG 2.0 / 2.1 / 2.2 A + AA, best practices)', '', `${axe.runs} runs. `);
  if (axe.violations.length === 0) lines[lines.length - 1] += 'No violations.';
  else {
    lines.push('| Where | Rule | Impact | Nodes | Example |', '| --- | --- | --- | --- | --- |');
    for (const v of axe.violations) lines.push(`| ${v.where} | ${v.id} | ${v.impact} | ${v.nodes} | \`${v.target}\` |`);
  }
  return lines.join('\n') + '\n';
}
