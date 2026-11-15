// Writes styles.css's two colour blocks from the living glaze (docs/examples/theme.md, D4, D13):
// :root gets the glaze at the light state's minute (12:30, Cobalto) and the footer's gold pair,
// html.dark-theme the glaze at the dark state's minute (02:00, Vidrado nocturno). Only the lines
// between the "glaze:" marker comments change. Run: npm run glaze (THEME-16 fails on a hand edit).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkTable, themeAt } from '../src/app/services/glaze.mjs';

const frontend = join(import.meta.dirname, '..');
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function declarations(table, state) {
  const hex = themeAt(table, table.states[state]).hex;
  const lines = Object.entries(table.map).flatMap(([k, names]) =>
    names.map((name) => `  ${name}: ${hex[k]};`),
  );
  if (state === 'light') {
    lines.push(`  --zc-foot-gold: ${table.fixed.footGold};`);
    lines.push(`  --zc-foot-on-gold: ${table.fixed.footOnGold};`);
  }
  return lines;
}

/** styles.css with its two colour blocks written from the table; refuses a bad table (THEME-P-07). */
export function renderStyles(css, table) {
  checkTable(table);
  for (const state of ['light', 'dark']) {
    const block = new RegExp(`/\\* glaze:${state}\\b[^]*?/\\* glaze:${state} end \\*/`);
    if (!block.test(css)) throw new Error(`styles.css has no glaze:${state} block`);
    const head =
      `/* glaze:${state}: the glaze at ${hhmm(table.states[state])}, written by npm run glaze ` +
      '(scripts/glaze-tokens.mjs) from\n     src/app/services/glaze.json. Never edit these lines ' +
      'by hand (THEME-16). */';
    const text = [head, ...declarations(table, state), `  /* glaze:${state} end */`].join('\n');
    css = css.replace(block, () => text);
  }
  return css;
}

/** Reads the table and styles.css, and writes styles.css only if the table passes. */
export function generate({
  table = join(frontend, 'src/app/services/glaze.json'),
  styles = join(frontend, 'src/styles.css'),
} = {}) {
  const css = renderStyles(readFileSync(styles, 'utf8'), JSON.parse(readFileSync(table, 'utf8')));
  writeFileSync(styles, css);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) generate();
