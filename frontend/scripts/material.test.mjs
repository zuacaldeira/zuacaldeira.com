// Source checks for Material under the living glaze (slice 2 of docs/examples/theme.md): Material
// has no palette of its own (THEME-17, B1), and the page's ground is the glaze's, not Material's
// (THEME-18, B2), and no override is left that Material no longer reads (THEME-19, B3).
// Run: npm run test:scripts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const src = join(import.meta.dirname, '../src');
const theme = () => readFileSync(join(src, 'material-theme.scss'), 'utf8');

test('THEME-17: material-theme.scss names no palette of Material', () => {
  assert.deepEqual(theme().match(/\$[a-z-]*palette\b/g) ?? [], []);
});

test("THEME-18: material-theme.scss's body takes no colour from Material", () => {
  const body = [...theme().matchAll(/(?:^|\n)[^\n{]*\bbody\s*\{([^}]*)\}/g)].map(([, d]) => d).join('');
  const colours = body
    .split(';')
    .map((d) => d.trim())
    .filter((d) => /^(background|color|background-color)\s*:.*--mat-sys-/.test(d));
  assert.deepEqual(colours, []);
});

// Material 21 reads --mat-* tokens; an --mdc-* custom property is a hook nothing reads.
test('THEME-19: no --mdc- override is left in the sources, named by file and line', () => {
  const sources = readdirSync(src, { recursive: true }).filter((f) => /\.(css|scss|html|ts)$/.test(f));
  const found = sources.flatMap((f) =>
    readFileSync(join(src, f), 'utf8')
      .split('\n')
      .flatMap((line, i) => (line.includes('--mdc-') ? [`${relative(src, join(src, f))}:${i + 1}`] : [])),
  );
  assert.deepEqual(found, []);
});
