import { describe, expect, it } from 'vitest';
import { splitHeadline } from './headline';

describe('splitHeadline', () => {
  it('highlights the last three words by default', () => {
    expect(splitHeadline('I build the systems your business runs on.')).toEqual({
      lead: 'I build the systems your',
      accent: 'business runs on.',
    });
  });

  it('highlights everything when the headline is short', () => {
    expect(splitHeadline('Hello there')).toEqual({ lead: '', accent: 'Hello there' });
  });

  it('honors a custom word count', () => {
    expect(splitHeadline('a b c d', 1)).toEqual({ lead: 'a b c', accent: 'd' });
  });
});
