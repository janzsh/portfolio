import { describe, expect, it } from 'vitest';
import { rankProjects, topProjects } from './project-ranking';

const project = (name: string, score: number) => ({ name, score });

describe('rankProjects', () => {
  it('puts the highest score first', () => {
    const ranked = rankProjects([project('Low', 10), project('High', 90), project('Mid', 50)]);

    expect(ranked.map((p) => p.name)).toEqual(['High', 'Mid', 'Low']);
  });

  it('breaks a tie by name so the order never depends on file order', () => {
    const ranked = rankProjects([project('Zeta', 70), project('Alpha', 70)]);

    expect(ranked.map((p) => p.name)).toEqual(['Alpha', 'Zeta']);
  });
});

describe('topProjects', () => {
  it('keeps only the best ones, best first', () => {
    const top = topProjects([project('C', 30), project('A', 90), project('E', 10), project('B', 60), project('D', 20)], 4);

    expect(top.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('returns every project when there are fewer than asked for', () => {
    expect(topProjects([project('Solo', 50)], 4).map((p) => p.name)).toEqual(['Solo']);
  });
});
