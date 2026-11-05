import { describe, expect, it } from 'vitest';
import { displayUrl } from './display-url';

describe('displayUrl', () => {
  it('drops the protocol, www and trailing slash for printing', () => {
    expect(displayUrl('https://www.linkedin.com/in/juanzuniga79/')).toBe('linkedin.com/in/juanzuniga79');
    expect(displayUrl('https://github.com/cd-janz')).toBe('github.com/cd-janz');
  });

  it('shows a bare origin without a trailing slash', () => {
    expect(displayUrl('https://janz.dev/')).toBe('janz.dev');
  });
});
