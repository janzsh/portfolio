import { describe, expect, it } from 'vitest';
import { buildChannels } from './channels';

const social = {
  github: 'https://github.com/janzsh',
  linkedin: 'https://www.linkedin.com/in/juanzuniga79/',
  telegram: 'https://t.me/janz7924',
};

describe('buildChannels', () => {
  it('derives the visible handle from each profile URL', () => {
    expect(buildChannels(social)).toEqual([
      { label: 'LinkedIn', href: social.linkedin, value: 'juanzuniga79' },
      { label: 'GitHub', href: social.github, value: 'janzsh' },
      { label: 'Telegram', href: social.telegram, value: '@janz7924' },
    ]);
  });

  it('never publishes an email or phone link, which scrapers and spam bots harvest', () => {
    for (const { href } of buildChannels(social)) {
      expect(href).not.toMatch(/^(mailto|tel):/);
    }
  });
});
