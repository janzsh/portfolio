/** Kept free of Zod so the client filter can import it without shipping the schema library. */
export const PROJECT_TYPES = ['personal', 'enterprise', 'freelancer', 'test'] as const;
export const PROJECT_KINDS = ['script', 'backend', 'frontend', 'fullstack'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ProjectKind = (typeof PROJECT_KINDS)[number];
