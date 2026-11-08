/** A piece of a content text: words, or notation that was written between backticks (D18). */
export interface CodeSpan {
  readonly text: string;
  readonly code: boolean;
}

/** Cuts a content text at its backticks: `&{…}` becomes notation, the rest stays words (D18). */
export function codeSpans(text: string): CodeSpan[] {
  return text
    .split('`')
    .map((piece, i) => ({ text: piece, code: i % 2 === 1 }))
    .filter((span) => span.text !== '');
}
