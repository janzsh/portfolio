import { describe, expect, it } from 'vitest';
import { highlight } from './highlight';

const kinds = (line: { tokens: { kind: string; text: string }[] }) => line.tokens.map((t) => `${t.kind}:${t.text}`);

describe('highlight json', () => {
  it('tells a key from a string value', () => {
    const [line] = highlight('json', '"name": "Ana",');
    expect(kinds(line)).toEqual(['key:"name"', 'punct::', 'text: ', 'string:"Ana"', 'punct:,']);
  });

  it('marks numbers and literals', () => {
    const lines = highlight('json', '"a": 12.5,\n"b": true,\n"c": null');
    expect(kinds(lines[0])).toContain('number:12.5');
    expect(kinds(lines[1])).toContain('literal:true');
    expect(kinds(lines[2])).toContain('literal:null');
  });

  it('turns two-space indentation into an indent level and keeps array items and braces', () => {
    const lines = highlight('json', '{\n  "stack": [\n    "Go"\n  ]\n}');
    expect(lines.map((l) => l.indent)).toEqual([0, 1, 2, 1, 0]);
    expect(kinds(lines[2])).toEqual(['string:"Go"']);
    expect(kinds(lines[0])).toEqual(['punct:{']);
  });

  it('does not mistake a colon or comma inside a string for punctuation', () => {
    const [line] = highlight('json', '"url": "https://a.dev/x, y",');
    expect(kinds(line)).toContain('string:"https://a.dev/x, y"');
  });

  it('keeps escaped quotes inside the string token', () => {
    const [line] = highlight('json', '"q": "say \\"hi\\""');
    expect(kinds(line)).toContain('string:"say \\"hi\\""');
  });
});

describe('highlight markdown', () => {
  it('splits headings, quotes and bullets', () => {
    const lines = highlight('markdown', '# Title\n> note\n- item');
    expect(kinds(lines[0])).toEqual(['punct:# ', 'heading:Title']);
    expect(kinds(lines[1])).toEqual(['punct:> ', 'muted:note']);
    expect(kinds(lines[2])).toEqual(['punct:- ', 'text:item']);
  });

  it('marks bold and inline code spans', () => {
    const [line] = highlight('markdown', 'a **b** and `c`');
    expect(kinds(line)).toEqual(['text:a ', 'bold:b', 'text: and ', 'code:`c`']);
  });

  it('keeps blank lines so line numbers match the source', () => {
    expect(highlight('markdown', 'a\n\nb')).toHaveLength(3);
  });
});
