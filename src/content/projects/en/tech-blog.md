---
name: "Tech blog"
year: "2026"
type: "personal"
kind: "frontend"
role: "Author"
summary: "A bilingual, multi-author tech blog with learning roadmaps and courses, built as a small system: a shared core and independent modules over typed content."
skills: ["Astro", "TypeScript", "Preact", "SCSS", "Zod", "Vitest"]
picture: "../../../assets/pictures/projects/tech-blog.png"
live: "https://blog.janzsh.com"
score: 75
---
**Problem.** A blog in two languages with several authors that can grow into roadmaps, courses and news without becoming one tangled codebase.

**Approach.** Static Astro with Preact islands only where there is interaction. Shared code lives in a `core` (content model, i18n, components) and each view is an independent module; a test fails if one module imports another or if `core` imports a module. Views receive typed data and a single file knows where it comes from, so moving from content collections to an API touches one place. Every post, author and category gets a deterministic generative pattern from its id, used as cover, banner and avatar.

**Status.** Live, with CI running types, tests and the build on every pull request. Private repository.
