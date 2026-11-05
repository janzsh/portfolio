import { durationBetween, formatDuration, formatMonthYear, parseDate } from '../../domain/dates';
import type { Locale } from '../../i18n/locales';
import type { Experience } from '../../schemas/experience';

export type ExperienceEntry = Experience & { id: string };

export interface ExperienceView extends ExperienceEntry {
  period: string;
  duration: string;
  current: boolean;
}

/** Content entry -> display model (period and duration already formatted). Pure. */
export function toExperienceView(
  entry: ExperienceEntry,
  locale: Locale,
  presentLabel: string,
  now: Date = new Date(),
): ExperienceView {
  const end = entry.end ? parseDate(entry.end) : now;
  return {
    ...entry,
    period: `${formatMonthYear(entry.start, locale)} – ${entry.end ? formatMonthYear(entry.end, locale) : presentLabel}`,
    duration: formatDuration(durationBetween(parseDate(entry.start), end), locale),
    current: !entry.end,
  };
}
