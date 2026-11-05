# Portfolio

Personal portfolio. Fast, accessible, SEO-first, minimalist and technical in tone. Bilingual (English default, Spanish).

## Stack

- **Astro** (static output by default) with **Preact** islands. Preact only where interactivity is needed.
- **bun** as package manager and runtime. Never `npm`/`npx`; use `bun` / `bunx`.
- **SCSS** + **BEM**. No Tailwind, no CSS-in-JS, no GSAP (animations are our own light modules).
- **Zod** + **Astro content collections** (Markdown or JSON) for all content.
- **Vitest** for tests. **TDD** (see `tdd` skill).
- Deploy: **Vercel**. Add `@astrojs/vercel` only if something truly needs SSR; stay static otherwise.
- `flake.nix` is a **local dev shell only** (bun, agent-browser, chromium). Enter with `nix develop`. Never reference it in CI/deploy.

Verify API details against the installed Astro/Preact versions before relying on memory; both move fast.

## Islands and JavaScript budget

- Default to `.astro` components (zero JS). A Preact island needs a reason: state, events, or browser APIs.
- Pick the lightest `client:*` directive that works: `client:visible` / `client:idle` before `client:load`. `client:only` only when SSR is impossible.
- Share state between islands with `@preact/signals`, not a state library.
- Use `preact/compat` aliasing only if a dependency requires React. Prefer no such dependency.
- Every new dependency must justify its bytes. Prefer a small own module over a heavy library.
- Skills for this area: `astro`, `preact-*`, `web-performance-patterns`.

## Styles: SCSS + BEM

- BEM naming: `.block`, `.block__element`, `.block--modifier`. Max one element level (`.card__title`, never `.card__body__title`). No styling by tag/ID, no deep nesting (max 3 levels in SCSS).
- One partial per block next to the component or in `src/styles/blocks/_name.scss`. Use `@use`/`@forward`, never `@import`.
- Layers: `abstracts/` (tokens, mixins, functions, no CSS output) → `base/` (reset, typography) → `blocks/` → `utilities/` (kept tiny).
- DRY rules: any value used twice becomes a token; any pattern used twice becomes a mixin/function (breakpoints, spacing scale, type scale, focus ring, visually-hidden). No magic numbers.
- Component-scoped `<style lang="scss">` in `.astro` files is fine; it must still follow BEM and use the shared tokens.

### Themes

- All theme values live in **one dedicated file**: `src/styles/abstracts/_themes.scss`. Components never hardcode colors.
- Color tokens are **bare RGB channel triplets** so they work with `rgb()` and `rgba()`:

  ```scss
  --color-bg: 255, 255, 255;
  // usage
  background: rgb(var(--color-bg));
  border-color: rgba(var(--color-fg), 0.12);
  ```

  Write them as `255, 255, 255` (commas), never `rgb(255, 255, 255)`. Use `rgba(var(--x), a)` for alpha (comma syntax; the `/ a` form does not work with comma triplets).
- Light is the base. Dark applies via `prefers-color-scheme: dark` **and** a manual switch (`[data-theme="dark"]` on `<html>`). An explicit `data-theme="light"` must beat the OS preference. Define the dark values once in a mixin and include it in both selectors (DRY).
- Persist the manual choice in `localStorage`. An inline blocking script in `<head>` sets `data-theme` before first paint (no flash). Wrap storage access in try/catch.
- Set `color-scheme` per theme and keep contrast at WCAG AA in both.

## i18n

- Locales: `en` (default) and `es`, fixed. Use Astro's built-in i18n routing; do not add an i18n library.
- English at `/`, Spanish at `/es/` (`prefixDefaultLocale: false`).
- UI strings live in typed dictionaries (`src/i18n/en.ts`, `es.ts`); a missing key in one locale must fail type-check. Content goes in collections per locale.
- Every page: `<html lang>`, `hreflang` alternates (including `x-default`), localized canonical URL, and a language switcher that links to the same page in the other locale.

## Content: collections + Zod

- Content in `src/content/` via content collections (`content.config.ts`), Markdown for prose, JSON for structured data (projects, experience, skills).
- Every collection has a Zod schema. Use the `z` that Astro exports so there is a single Zod version; validate any other external data (forms, env) with Zod as well.
- Never read raw files or hardcode content in components; query collections and pass typed props.
- Schemas include SEO fields (title, description, og image, dates) where relevant.

## Animations

- Own small modules (`src/scripts/motion/`), not a library. Prefer CSS (transitions, `@starting-style`, scroll-driven animations, View Transitions) and fall back to a tiny JS helper only when CSS cannot do it.
- Animate only `transform` and `opacity`. No layout-thrashing properties.
- Always honor `prefers-reduced-motion: reduce` (disable or replace with a fade). Never gate content visibility on JS animation.
- Load motion code lazily and only on pages that use it.

## SEO, accessibility, performance

- Semantic HTML first; one `<h1>` per page; landmarks; skip link; visible `:focus-visible`; full keyboard support; WCAG 2.2 AA.
- Per page: unique `<title>` and meta description, canonical, Open Graph/Twitter cards, JSON-LD (Person/WebSite), sitemap, `robots.txt`.
- Images via Astro `<Image>`/`<Picture>`: explicit dimensions, modern formats, lazy-load below the fold, eager + `fetchpriority` for the LCP image.
- Fonts: self-hosted, subsetted, `font-display: swap`, preloaded only for critical weights.
- Targets: Lighthouse 100/100/100/100 on mobile, LCP < 2s, CLS 0, INP < 200ms.
- Skills: `seo`, `accessibility`, `web-design-guidelines`, `frontend-design`, `web-performance-patterns`.

## Engineering principles

Applied pragmatically; this is a small site, so favor the simplest thing that works.

- **KISS:** the simplest solution that meets the requirement. No abstraction layers, patterns or folders "for later".
- **YAGNI:** build only what the current task needs. No speculative props, options, configs or extension points. Delete dead code.
- **DRY:** one source of truth for each piece of knowledge (tokens, content, strings, types). Remove duplication on the second occurrence of *the same knowledge*; do not merge code that merely looks alike (wait for the third use if the shape is still unclear).
- **S, single responsibility:** a component or function does one thing. Split when it needs "and" to be described, or exceeds ~80 lines (file ~200).
- **O, open/closed:** extend via props, slots, variants (BEM modifiers) and data, not by editing working code.
- **L, Liskov:** components sharing a contract (e.g. all cards) must be interchangeable without special cases.
- **I, interface segregation:** small, specific prop types. No giant props object where a component uses two fields.
- **D, dependency inversion:** components depend on typed data (collection entries, dictionaries), not on where the data comes from; isolate browser/IO access behind small modules so they can be tested.
- Early returns over nested conditionals. Domain-specific names over `utils`/`helpers`/`common`.
- Strict TypeScript, no `any`. Comments only for non-obvious *why*.

## Testing (TDD with Vitest)

- Use the `tdd` skill: red → green, one vertical slice at a time. **Agree the seams to test with the user before writing tests.**
- Test behavior through public interfaces, not internals. Mock only system boundaries (network, time, randomness, storage). Never mock our own modules.
- Expected values come from independent literals or the spec, never recomputed like the code does.
- Pure logic (i18n helpers, theme logic, schema parsing, motion helpers) gets unit tests. Zod schemas get tests with valid and invalid fixtures. Islands get tested through rendered behavior.
- Visual/interactive checks in a real browser with `agent-browser` (run inside `nix develop`).

## Workflow

- Commands (once the project exists): `bun install`, `bun dev`, `bun run build`, `bun run test`, `bun run check` (`astro check` + type-check).
- Before calling a task done: tests pass, `astro check` is clean, and UI changes were looked at in a browser in both themes and both locales.
- Skills live in `.claude/skills/` (lock file: `skills-lock.json`). Add with `bunx skills add <owner/repo> -s <skill> -a claude-code -y`.
- Commit only when asked. Keep commits small and focused.
