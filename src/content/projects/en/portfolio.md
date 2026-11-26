---
name: "janzsh.com"
year: "2026"
type: "personal"
kind: "fullstack"
role: "Author"
summary: "This portfolio: a bilingual static site with Astro and Preact islands, Zod-validated content and automated test, accessibility and performance checks on every pull request."
skills: ["Astro", "TypeScript", "Preact", "SCSS", "Zod", "Vitest"]
picture: "../../../assets/pictures/projects/portfolio.png"
repo: "https://github.com/janzsh/portfolio"
score: 80
---
**Problem.** A portfolio in two languages that loads fast, is accessible and can change without fear of breaking it.

**Approach.** Static HTML by default and Preact islands only where there is interaction. Content lives in Zod-validated collections and UI strings in typed dictionaries: a missing translation does not compile. Styles in SCSS with BEM and light and dark theme tokens. Logic is built test-first with Vitest, and the contact form validates on the server and rate-limits submissions.

**Result.** Lighthouse 100 in all four categories on mobile and desktop, no axe-core violations and more than 190 tests. CI repeats those checks on every pull request. I built it with AI assistance (Claude Code), following the conventions documented in the repository.
