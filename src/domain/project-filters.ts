import type { Stack } from '../schemas/stack';
import { PROJECT_KINDS, PROJECT_TYPES } from './project-facets';

export type FilterGroup = 'language' | 'framework' | 'tech' | 'type' | 'kind';
export type FilterSelection = Partial<Record<FilterGroup, string>>;

/** What the filter needs from a project. `searchSkills` already includes the languages its frameworks imply. */
export interface FilterableProject {
  searchSkills: readonly string[];
  type: string;
  kind: string;
}

export interface LanguageOption { name: string; frameworks: string[] }
export interface FilterOptions {
  languages: LanguageOption[];
  others: string[];
  types: string[];
  kinds: string[];
}

const toArray = (value: string | string[] | undefined): string[] => [value ?? []].flat();

/** A project that lists NestJS is also a TypeScript project, even if it never says so. */
export function withImpliedLanguages(skills: readonly string[], stack: Stack): string[] {
  const languagesOf = new Map(
    stack.technologies.filter((tech) => tech.category === 'framework').map((tech) => [tech.name, toArray(tech.language)]),
  );
  return [...new Set(skills.flatMap((skill) => [skill, ...(languagesOf.get(skill) ?? [])]))];
}

/** Options come from what the projects actually use, so no chip ever leads to an empty list. */
export function buildFilterOptions(projects: readonly FilterableProject[], stack: Stack): FilterOptions {
  const used = new Set(projects.flatMap((project) => project.searchSkills));
  const languages = stack.technologies
    .filter((tech) => tech.category === 'language' && used.has(tech.name))
    .map((language) => ({
      name: language.name,
      frameworks: stack.technologies
        .filter((tech) => tech.category === 'framework' && used.has(tech.name) && toArray(tech.language).includes(language.name))
        .map((framework) => framework.name),
    }));
  const classified = new Set(stack.technologies.filter((tech) => tech.category).map((tech) => tech.name));
  return {
    languages,
    others: [...used].filter((skill) => !classified.has(skill)),
    types: PROJECT_TYPES.filter((type) => projects.some((project) => project.type === type)),
    kinds: PROJECT_KINDS.filter((kind) => projects.some((project) => project.kind === kind)),
  };
}

const skillGroups = { language: true, framework: true, tech: true } as const;

export function matchesProject(project: FilterableProject, selection: FilterSelection): boolean {
  return (Object.entries(selection) as [FilterGroup, string][]).every(([group, value]) =>
    group in skillGroups ? project.searchSkills.includes(value) : project[group as 'type' | 'kind'] === value,
  );
}

/** Single choice per group; an empty value clears it. A framework only makes sense under its language, so changing the language clears it. */
export function setSelection(selection: FilterSelection, group: FilterGroup, value: string): FilterSelection {
  const { [group]: _previous, ...rest } = selection;
  const next: FilterSelection = value ? { ...rest, [group]: value } : rest;
  if (group !== 'language') return next;
  const { framework: _dropped, ...withoutFramework } = next;
  return withoutFramework;
}
