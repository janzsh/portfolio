/** Single source of truth for site-wide constants. No logic here. */
export const SITE = {
  name: 'Juan Camilo Zúñiga',
  handle: 'cd-janz',
  url: 'https://janz.dev',
  designer: 'RZOR',
  email: 'you@example.com',
  phone: { display: '+00 000 000 0000', href: 'tel:+000000000000' },
  social: {
    github: 'https://github.com/cd-janz',
    linkedin: 'https://www.linkedin.com/in/juanzuniga79/',
    telegram: 'https://t.me/janz7924',
    whatsapp: 'https://wa.me/qr/REDACTED',
  },
} as const;
