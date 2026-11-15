// The site's colour tokens are the glaze's (docs/examples/theme.md, slice 1, D4): styles.css's two
// colour blocks are written by glaze-tokens.mjs, never by hand. Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { themeAt } from '../src/app/services/glaze.mjs';

const frontend = join(import.meta.dirname, '..');
const table = JSON.parse(readFileSync(join(frontend, 'src/app/services/glaze.json'), 'utf8'));
const stylesPath = join(frontend, 'src/styles.css');

// The declarations between "/* glaze:<name>" and "/* glaze:<name> end */", and the rule they open.
function block(css, name) {
  const found = css.match(
    new RegExp(`([^{}]*)\\{\\s*/\\* glaze:${name}\\b[^]*?\\*/([^]*?)/\\* glaze:${name} end \\*/`),
  );
  if (!found) return { rule: null, tokens: {} };
  const tokens = Object.fromEntries(
    [...found[2].matchAll(/(--zc-[\w-]+):\s*([^;]+);/g)].map(([, n, v]) => [n, v.trim()]),
  );
  return { rule: found[1].trim().split('\n').at(-1).trim(), tokens };
}

// The glaze at a state's minute, through the map, as styles.css should declare it.
function want(minute) {
  const hex = themeAt(table, minute).hex;
  return Object.fromEntries(
    Object.entries(table.map).flatMap(([k, names]) => names.map((n) => [n, hex[k]])),
  );
}

const COLOUR = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i;

test("THEME-16: styles.css's colour tokens are the glaze's at 12:30 and 02:00, none typed by hand", () => {
  const css = readFileSync(stylesPath, 'utf8');
  const light = block(css, 'light');
  const dark = block(css, 'dark');
  const outside = css
    .replace(/\/\* glaze:(light|dark)\b[^]*?\/\* glaze:\1 end \*\//g, '')
    .split('\n')
    .filter((line) => /--zc-[\w-]+:/.test(line) && COLOUR.test(line))
    .filter((line) => !/--zc-shadow-/.test(line))
    .map((line) => line.trim());

  assert.deepEqual(
    { light, dark, outside },
    {
      light: {
        rule: ':root',
        tokens: {
          ...want(table.states.light),
          '--zc-foot-gold': table.fixed.footGold,
          '--zc-foot-on-gold': table.fixed.footOnGold,
        },
      },
      dark: { rule: 'html.dark-theme', tokens: want(table.states.dark) },
      outside: [],
    },
  );
});
