import type { Language, Line, Token } from './types';

const token = (kind: Token['kind'], text: string): Token => ({ kind, text });

// string (and an optional trailing colon, which makes it a key) | number | literal | punctuation | whitespace
const JSON_TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],:])|(\s+)/g;

/** One line of pretty-printed JSON (two-space indentation). */
function jsonLine(raw: string): Line {
  const lead = raw.length - raw.trimStart().length;
  const tokens: Token[] = [];
  for (const match of raw.slice(lead).matchAll(JSON_TOKEN)) {
    const [, string, colon, number, literal, punct, space] = match;
    if (string) tokens.push(token(colon ? 'key' : 'string', string), ...(colon ? [token('punct', ':')] : []));
    else if (number) tokens.push(token('number', number));
    else if (literal) tokens.push(token('literal', literal));
    else if (punct) tokens.push(token('punct', punct));
    else if (space) tokens.push(token('text', space));
  }
  return { indent: Math.floor(lead / 2), tokens };
}

/** Splits inline `**bold**` and `code` spans. */
function inline(text: string): Token[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part): Token => {
      if (part.startsWith('**')) return token('bold', part.slice(2, -2));
      if (part.startsWith('`')) return token('code', part);
      return token('text', part);
    });
}

/** One line of Markdown: headings, quotes, bullets and inline emphasis. */
function markdownLine(raw: string): Line {
  const heading = raw.match(/^(#{1,6})\s+(.*)$/);
  if (heading) return { indent: 0, tokens: [token('punct', `${heading[1]} `), token('heading', heading[2])] };
  const quote = raw.match(/^>\s?(.*)$/);
  if (quote) return { indent: 0, tokens: [token('punct', '> '), token('muted', quote[1])] };
  const bullet = raw.match(/^[-*]\s+(.*)$/);
  if (bullet) return { indent: 0, tokens: [token('punct', '- '), ...inline(bullet[1])] };
  return { indent: 0, tokens: inline(raw) };
}

/** Source text -> highlightable lines, one per source line so numbers match. Pure. */
export function highlight(language: Language, source: string): Line[] {
  const toLine = language === 'json' ? jsonLine : markdownLine;
  return source.split('\n').map(toLine);
}
