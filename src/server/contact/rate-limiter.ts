export interface RateLimiter {
  /** Returns true when the key is still within its allowance. */
  allow(key: string): boolean;
}

/**
 * Sliding-window limiter kept in memory. On serverless platforms each instance has
 * its own window, so this is a best-effort guard; swap the implementation (e.g. Upstash)
 * without touching the use case if stricter limits are needed.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  allow(key: string): boolean {
    const t = this.now();
    const recent = (this.hits.get(key) ?? []).filter((time) => t - time < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    this.hits.set(key, [...recent, t]);
    return true;
  }
}
