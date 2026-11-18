import { describe, expect, it } from 'vitest';
import { InMemoryRateLimiter } from './rate-limiter';

const clock = (start = 0) => {
  let now = start;
  return { now: () => now, advance: (ms: number) => void (now += ms) };
};

describe('InMemoryRateLimiter', () => {
  it('allows up to the limit inside the window, then blocks', () => {
    const c = clock();
    const limiter = new InMemoryRateLimiter(2, 1000, c.now);
    expect([limiter.allow('a'), limiter.allow('a'), limiter.allow('a')]).toEqual([true, true, false]);
  });

  it('lets a client back in once its hits fall out of the window', () => {
    const c = clock();
    const limiter = new InMemoryRateLimiter(1, 1000, c.now);
    expect(limiter.allow('a')).toBe(true);
    c.advance(999);
    expect(limiter.allow('a')).toBe(false);
    c.advance(1);
    expect(limiter.allow('a')).toBe(true);
  });

  it('counts each client separately', () => {
    const limiter = new InMemoryRateLimiter(1, 1000, clock().now);
    expect(limiter.allow('a')).toBe(true);
    expect(limiter.allow('b')).toBe(true);
  });

  it('expires staggered hits individually while keeping recent hits in the window', () => {
    const c = clock();
    const limiter = new InMemoryRateLimiter(2, 1000, c.now);

    expect(limiter.allow('a')).toBe(true); // 0 ms
    c.advance(400);
    expect(limiter.allow('a')).toBe(true); // 400 ms
    c.advance(599);
    expect(limiter.allow('a')).toBe(false); // 999 ms: both hits still count
    c.advance(1);
    expect(limiter.allow('a')).toBe(true); // 1000 ms: only the first hit expired
    expect(limiter.allow('a')).toBe(false);
    c.advance(399);
    expect(limiter.allow('a')).toBe(false); // 1399 ms: the second hit still counts
    c.advance(1);
    expect(limiter.allow('a')).toBe(true); // 1400 ms: the second hit expires
    expect(limiter.allow('a')).toBe(false);
  });
});
