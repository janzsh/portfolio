import type { Locale } from './locales';

/** Static UI copy. Long-form content lives in `src/content`. */
export interface UiStrings {
  skipToContent: string;
  nav: { home: string; skills: string; experience: string; education: string; projects: string; contact: string };
  resume: string;
  switchLanguage: string;
  hero: { eyebrow: string; cta: string; secondaryCta: string; available: string };
  sections: { about: string; skills: string; experience: string; education: string; projects: string; code: string; contact: string };
  titles: { skills: string; experience: string; education: string; projects: string; code: string; contact: string };
  experience: { present: string; responsibilities: string; moreStack: string };
  more: { skills: string; experience: string; projects: string };
  skills: { since: string; usedIn: string; status: string; production: string; handsOn: string; learning: string; tech: string; alsoLabel: string; tiers: Record<'primary' | 'secondary' | 'tertiary' | 'growing' | 'also', string> };
  pages: { back: string; skills: { title: string }; experience: { title: string; lead: string }; projects: { title: string; lead: string } };
  ide: { menu: string[]; explorer: string; projects: string; terminal: string; output: string; emptyEditor: string; openToWork: string; closeFile: string; sampleNote: string };
  projects: { sample: string; code: string; live: string; details: string; close: string };
  contactInfo: { lead: string; direct: string; phone: string };
  contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
    rateLimited: string;
    invalid: string;
  };
  resumePage: { title: string; print: string; back: string; experience: string; education: string; projects: string; skills: string; contact: string; present: string };
  notFound: { title: string; text: string; home: string };
  footer: { designedBy: string; builtBy: string };
}

const en: UiStrings = {
  skipToContent: 'Skip to content',
  nav: { home: 'Home', skills: 'Skills', experience: 'Experience', education: 'Education', projects: 'Projects', contact: 'Contact' },
  resume: 'Resume',
  switchLanguage: 'Español',
  hero: {
    eyebrow: 'Available for new roles',
    cta: 'Let’s talk',
    secondaryCta: 'See my work',
    available: 'Remote · Hybrid · Open to relocation',
  },
  sections: {
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    projects: 'Selected work',
    code: 'Under the hood',
    contact: 'Contact',
  },
  titles: {
    skills: 'Technologies I trust, and where I proved them',
    experience: 'Where I’ve built, and what it delivered',
    education: 'The foundation behind the work',
    projects: 'Work that shows how I think',
    code: 'Browse my career like a codebase',
    contact: 'Let’s build something solid together',
  },
  experience: { present: 'Present', responsibilities: 'What I did', moreStack: 'more' },
  more: { skills: 'See full stack', experience: 'See full experience', projects: 'See all projects' },
  skills: {
    since: 'Since', usedIn: 'Used in', status: 'Status', tech: 'Technology', alsoLabel: 'Also worked with',
    production: 'In production', handsOn: 'Hands-on', learning: 'Learning',
    tiers: { primary: 'Primary', secondary: 'Secondary', tertiary: 'Around the stack', growing: 'Growing focus', also: 'Also' },
  },
  pages: {
    back: 'Back to home',
    skills: { title: 'Full stack' },
    experience: { title: 'Full experience', lead: 'Every role in detail: what I did, what it delivered and the stack behind it.' },
    projects: { title: 'All projects', lead: 'Beyond the highlights: professional work, tests and personal experiments.' },
  },
  ide: { menu: ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'], explorer: 'Explorer', projects: 'Projects', terminal: 'Terminal', output: 'Output', emptyEditor: 'Select a file to open it', openToWork: 'Open to work', closeFile: 'Close', sampleNote: 'Sample content' },
  projects: { sample: 'Sample', code: 'Code', live: 'Live', details: 'Case study', close: 'Close' },
  contactInfo: {
    lead: 'Hiring, a project or just a technical question? Write me and I’ll reply within 24 hours.',
    direct: 'Prefer a direct channel?',
    phone: 'Phone',
  },
  contact: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    sent: 'Message sent. I’ll reply within 24 hours.',
    error: 'Something went wrong. Please try again or email me directly.',
    rateLimited: 'Too many attempts. Please wait a minute and try again.',
    invalid: 'Please check the highlighted fields.',
  },
  resumePage: { title: 'Resume', print: 'Download PDF', back: 'Back to site', experience: 'Experience', education: 'Education', projects: 'Selected projects', skills: 'Skills', contact: 'Contact', present: 'Present' },
  notFound: { title: 'Page not found', text: 'The page you’re looking for doesn’t exist.', home: 'Back home' },
  footer: { designedBy: 'Designed by', builtBy: 'built by' },
};

const es: UiStrings = {
  skipToContent: 'Saltar al contenido',
  nav: { home: 'Inicio', skills: 'Skills', experience: 'Experiencia', education: 'Educación', projects: 'Proyectos', contact: 'Contacto' },
  resume: 'Currículum',
  switchLanguage: 'English',
  hero: {
    eyebrow: 'Disponible para nuevos retos',
    cta: 'Hablemos',
    secondaryCta: 'Ver mi trabajo',
    available: 'Remoto · Híbrido · Dispuesto a reubicarme',
  },
  sections: {
    about: 'Sobre mí',
    skills: 'Skills',
    experience: 'Experiencia',
    education: 'Educación',
    projects: 'Trabajo destacado',
    code: 'Bajo el capó',
    contact: 'Contacto',
  },
  titles: {
    skills: 'Tecnologías en las que confío y dónde las demostré',
    experience: 'Dónde he construido y qué logré',
    education: 'La base detrás del trabajo',
    projects: 'Trabajo que muestra cómo pienso',
    code: 'Explora mi trayectoria como un repositorio',
    contact: 'Construyamos algo sólido juntos',
  },
  experience: { present: 'Actualidad', responsibilities: 'Qué hice', moreStack: 'más' },
  more: { skills: 'Ver stack completo', experience: 'Ver experiencia completa', projects: 'Ver todos los proyectos' },
  skills: {
    since: 'Desde', usedIn: 'Usada en', status: 'Estado', tech: 'Tecnología', alsoLabel: 'También he trabajado con',
    production: 'En producción', handsOn: 'Práctica', learning: 'Aprendiendo',
    tiers: { primary: 'Principal', secondary: 'Secundario', tertiary: 'Alrededor del stack', growing: 'Foco en crecimiento', also: 'Además' },
  },
  pages: {
    back: 'Volver al inicio',
    skills: { title: 'Stack completo' },
    experience: { title: 'Experiencia completa', lead: 'Cada rol en detalle: qué hice, qué logró y el stack detrás.' },
    projects: { title: 'Todos los proyectos', lead: 'Más allá de lo destacado: trabajo profesional, pruebas y experimentos personales.' },
  },
  ide: { menu: ['Archivo', 'Editar', 'Selección', 'Ver', 'Ir', 'Ejecutar', 'Terminal', 'Ayuda'], explorer: 'Explorador', projects: 'Proyectos', terminal: 'Terminal', output: 'Salida', emptyEditor: 'Selecciona un archivo para abrirlo', openToWork: 'Disponible', closeFile: 'Cerrar', sampleNote: 'Contenido de ejemplo' },
  projects: { sample: 'Ejemplo', code: 'Código', live: 'En vivo', details: 'Caso de estudio', close: 'Cerrar' },
  contactInfo: {
    lead: '¿Contratación, un proyecto o solo una duda técnica? Escríbeme y te respondo en menos de 24 horas.',
    direct: '¿Prefieres un canal directo?',
    phone: 'Teléfono',
  },
  contact: {
    name: 'Nombre',
    email: 'Correo',
    subject: 'Asunto',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    sent: 'Mensaje enviado. Te responderé en menos de 24 horas.',
    error: 'Algo salió mal. Inténtalo de nuevo o escríbeme directamente.',
    rateLimited: 'Demasiados intentos. Espera un minuto e inténtalo otra vez.',
    invalid: 'Revisa los campos marcados.',
  },
  resumePage: { title: 'Currículum', print: 'Descargar PDF', back: 'Volver al sitio', experience: 'Experiencia', education: 'Educación', projects: 'Proyectos destacados', skills: 'Habilidades', contact: 'Contacto', present: 'Actualidad' },
  notFound: { title: 'Página no encontrada', text: 'La página que buscas no existe.', home: 'Volver al inicio' },
  footer: { designedBy: 'Diseñado por', builtBy: 'construido por' },
};

const dictionaries: Record<Locale, UiStrings> = { en, es };

export const ui = (locale: Locale): UiStrings => dictionaries[locale];
