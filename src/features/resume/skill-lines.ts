import type { SkillGroup } from '../../domain/skills';

export interface SkillLine {
  title: string;
  items: string;
}

/** One printable line per group: "Backend: Go, Java, Kotlin (learning)". */
export function skillLines(groups: SkillGroup[], learningLabel: string): SkillLine[] {
  return groups
    .filter((group) => group.items.length > 0)
    .map((group) => {
      const items = group.items.map((item) => (item.status === 'learning' ? `${item.name} (${learningLabel.toLowerCase()})` : item.name));
      // A group that only repeats its own name (e.g. Python) reads better without the label.
      const repeatsItself = group.items.length === 1 && group.items[0].name === group.title;
      return { title: repeatsItself ? '' : group.title, items: items.join(', ') };
    });
}
