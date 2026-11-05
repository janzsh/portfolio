import type { Line } from './model/types';

/** Highlighted source with line numbers (drawn by CSS, so they are not selectable). */
export function CodeView({ lines, labelledBy }: { lines: readonly Line[]; labelledBy: string }) {
  return (
    <div class="ide__code" role="region" aria-labelledby={labelledBy} tabIndex={0}>
      {lines.map((line, index) => (
        <div key={index} class="ide__line" style={`--indent:${line.indent}`}>
          {line.tokens.map((token, i) => (
            <span key={i} class={`ide__token ide__token--${token.kind}`}>
              {token.text}
            </span>
          ))}
          {line.tokens.length === 0 && '​'}
        </div>
      ))}
    </div>
  );
}
