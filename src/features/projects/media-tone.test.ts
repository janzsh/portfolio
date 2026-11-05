import { describe, expect, it } from 'vitest';
import { mediaTone } from './media-tone';

describe('mediaTone', () => {
  it('is stable for the same project id', () => {
    expect(mediaTone('efrouting')).toBe(mediaTone('efrouting'));
  });

  it('always lands on one of the three accent pairings', () => {
    for (const id of ['a', 'efrouting', 'fleet-dashboard', 'igd-plus', 'ledger-platform', 'neovim']) {
      expect([0, 1, 2]).toContain(mediaTone(id));
    }
  });

  it('spreads different ids across the pairings', () => {
    const tones = new Set(['a', 'bb', 'ccc'].map(mediaTone));
    expect(tones.size).toBeGreaterThan(1);
  });
});
