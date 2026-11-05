import { parseDate } from './dates';

export interface Dated {
  start: string;
  end?: string;
}

/** Most recent first. Never mutates the input. */
export const sortNewestFirst = <T extends Dated>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => parseDate(b.start).getTime() - parseDate(a.start).getTime());
