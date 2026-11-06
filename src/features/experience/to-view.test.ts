import { describe, expect, it } from 'vitest';
import { toExperienceView, type ExperienceEntry } from './to-view';

const entry = (over: Partial<ExperienceEntry> = {}): ExperienceEntry => ({
  id: 'acme',
  company: 'Acme',
  role: 'Engineer',
  mode: 'Remote',
  location: 'Bogotá',
  summary: 's',
  start: '01/2020',
  end: '03/2022',
  responsibilities: [],
  achievements: [],
  stack: [],
  ...over,
});
const now = new Date(2024, 5, 15); // June 2024

describe('toExperienceView', () => {
  it('formats a finished position as a period and a duration', () => {
    const view = toExperienceView(entry(), 'en', 'Present', now);
    expect(view.period).toBe('Jan 2020 – Mar 2022');
    expect(view.duration).toBe('2 yrs 2 mos');
    expect(view.current).toBe(false);
  });

  it('shows the present label and measures up to now for the current position', () => {
    const view = toExperienceView(entry({ end: undefined, start: '06/2023' }), 'en', 'Present', now);
    expect(view.period).toBe('Jun 2023 – Present');
    expect(view.duration).toBe('1 yr');
    expect(view.current).toBe(true);
  });

  it('splits the start date into a short month and a year for the date badge', () => {
    const view = toExperienceView(entry({ start: '09/02/2026' }), 'en', 'Present', now);
    expect(view.startMonth).toBe('Feb');
    expect(view.startYear).toBe('2026');
    expect(toExperienceView(entry({ start: '01/2020' }), 'es', 'Actualidad', now).startMonth).toBe('ene');
  });

  it('localizes the duration', () => {
    expect(toExperienceView(entry(), 'es', 'Actualidad', now).duration).toBe('2 años 2 meses');
  });

  it('keeps the rest of the entry untouched', () => {
    const view = toExperienceView(entry({ stack: ['Go'] }), 'en', 'Present', now);
    expect(view).toMatchObject({ id: 'acme', company: 'Acme', stack: ['Go'] });
  });
});
