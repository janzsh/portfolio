import type { Locale } from '../i18n/locales';
import type { SkillsCopy } from '../schemas/skills-copy';
import type { Stack, TechStatus, Tier } from '../schemas/stack';
import { formatMonthYear } from './dates';

export interface Evidence { label: string; href: string; }

export interface SkillItem {
  name: string;
  since?: string;
  status: TechStatus;
  usedIn: Evidence[];
}

export interface SkillGroup {
  id: string;
  tier: Tier;
  title: string;
  description: string;
  items: SkillItem[];
}

/** Splits evidence into what the table shows and what collapses into a "+N" counter. */
export function limitEvidence(usedIn: Evidence[], max: number): { shown: Evidence[]; hidden: Evidence[] } {
  return { shown: usedIn.slice(0, max), hidden: usedIn.slice(max) };
}

/** Maps `project:efrouting` / `experience:igd` to something displayable, or undefined when unknown. */
export type EvidenceResolver = (ref: string) => Evidence | undefined;

/**
 * Joins language-neutral stack data with localized copy. Pure.
 * Group order follows `stack.groups`; items keep their file order (most important first).
 */
export function buildSkillGroups(
  stack: Stack,
  copy: SkillsCopy,
  resolve: EvidenceResolver,
  locale: Locale,
): SkillGroup[] {
  return stack.groups.map(({ id, tier }) => {
    const text = copy.groups[id];
    if (!text) throw new Error(`Missing skills copy for group "${id}" (${locale})`);
    const items = stack.technologies
      .filter((t) => [t.group].flat().includes(id))
      .map((t): SkillItem => ({
        name: t.name,
        since: t.since ? formatMonthYear(t.since, locale) : undefined,
        status: t.status,
        usedIn: t.usedIn.flatMap((ref) => resolve(ref) ?? []),
      }));
    return { id, tier, title: text.title, description: text.description, items };
  });
}

/** The focus groups (shown as cards) and the one "also worked with" group (shown as a line). */
export function splitSkillGroups(groups: SkillGroup[]): { focus: SkillGroup[]; also: SkillGroup | undefined } {
  return { focus: groups.filter((group) => group.tier !== 'also'), also: groups.find((group) => group.tier === 'also') };
}
