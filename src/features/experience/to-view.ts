import { durationBetween, formatDuration, dateBadge, formatMonthYear, parseDate } from '../../domain/dates';
import type { Locale } from '../../i18n/locales';
import type { Experience } from '../../schemas/experience';

export type ExperienceEntry = Experience & { id: string };

export interface ExperienceView extends ExperienceEntry {
  /** Short month and year of the start date, for the badge on the card. */
  startMonth: string;
  startYear: string;
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
    startMonth: dateBadge(entry.start, locale).month,
    startYear: dateBadge(entry.start, locale).year,
    period: `${formatMonthYear(entry.start, locale)} – ${entry.end ? formatMonthYear(entry.end, locale) : presentLabel}`,
    duration: formatDuration(durationBetween(parseDate(entry.start), end), locale),
    current: !entry.end,
  };
}
