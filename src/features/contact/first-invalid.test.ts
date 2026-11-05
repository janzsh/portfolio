import { describe, expect, it } from 'vitest';
import { firstInvalidField } from './first-invalid';

const order = ['name', 'email', 'message'];

describe('firstInvalidField', () => {
  it('returns the first field in form order that has an error, not in error-object order', () => {
    expect(firstInvalidField({ message: 'Too short', email: 'Invalid' }, order)).toBe('email');
  });

  it('ignores errors on fields the form does not show', () => {
    expect(firstInvalidField({ website: 'spam' }, order)).toBeUndefined();
  });

  it('returns nothing when there are no errors', () => {
    expect(firstInvalidField({}, order)).toBeUndefined();
  });
});
