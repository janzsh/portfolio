/** Pure date helpers. Inputs are `MM/YYYY` or `DD/MM/YYYY`. */
export function parseDate(value: string): Date {
  const parts = value.split('/').map(Number);
  const [day, month, year] = parts.length === 3 ? parts : [1, parts[0], parts[1]];
  return new Date(year, month - 1, day);
}

export interface Duration {
  years: number;
  months: number;
}

export function durationBetween(start: Date, end: Date): Duration {
  const total = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const clamped = Math.max(total, 0);
  return { years: Math.floor(clamped / 12), months: clamped % 12 };
}

export function formatDuration({ years, months }: Duration, locale: 'en' | 'es'): string {
  const y = locale === 'es' ? (years === 1 ? 'año' : 'años') : years === 1 ? 'yr' : 'yrs';
  const m = locale === 'es' ? (months === 1 ? 'mes' : 'meses') : months === 1 ? 'mo' : 'mos';
  const parts = [years > 0 && `${years} ${y}`, months > 0 && `${months} ${m}`].filter(Boolean);
  return parts.length ? parts.join(' ') : locale === 'es' ? 'Menos de un mes' : 'Under a month';
}

export function formatMonthYear(value: string, locale: 'en' | 'es'): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(parseDate(value));
}
