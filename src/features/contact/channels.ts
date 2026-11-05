export interface Channel {
  label: string;
  href: string;
  value: string;
}

interface Social {
  github: string;
  linkedin: string;
  telegram: string;
}

/** Last non-empty path segment of a profile URL: the handle people recognise. */
const handleOf = (url: string): string => new URL(url).pathname.split('/').filter(Boolean).pop() ?? url;

/**
 * Public profiles only. Email and phone are deliberately not channels: a plain address or
 * number in the HTML is harvested by scrapers; the form is the way to write.
 */
export const buildChannels = (social: Social): Channel[] => [
  { label: 'LinkedIn', href: social.linkedin, value: handleOf(social.linkedin) },
  { label: 'GitHub', href: social.github, value: handleOf(social.github) },
  { label: 'Telegram', href: social.telegram, value: `@${handleOf(social.telegram)}` },
];
