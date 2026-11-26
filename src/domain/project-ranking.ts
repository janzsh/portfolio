interface Ranked { name: string; score: number; }

/** Highest score first; ties go by name so the order never depends on file order. Returns a new array. */
export function rankProjects<T extends Ranked>(projects: readonly T[]): T[] {
  return [...projects].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** The `count` best projects, best first. */
export function topProjects<T extends Ranked>(projects: readonly T[], count: number): T[] {
  return rankProjects(projects).slice(0, count);
}
