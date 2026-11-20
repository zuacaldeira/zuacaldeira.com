// Acceptance tests for the theme at first paint, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: THEME-10 in docs/examples/theme.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');
// The site's rule, the same table ThemeService's spec reads (D25).
const cases = JSON.parse(
  readFileSync(join(import.meta.dirname, '../src/app/services/theme-rule.cases.json'), 'utf8'),
);

// The inline scripts in a page's <head>, before anything is drawn.
const headScripts = (html) =>
  [...(html.match(/<head>(.*?)<\/head>/s)?.[1] ?? '').matchAll(/<script>(.*?)<\/script>/gs)].map(
    ([, code]) => code,
  );

// Runs the head's scripts with a saved choice and a device setting; is the page dark?
const darkAtFirstPaint = (html, { saved, deviceDark }) => {
  const classes = new Set();
  runInNewContext(headScripts(html).join(';\n'), {
    localStorage: { getItem: (key) => (key === 'zc-theme' ? saved : null) },
    matchMedia: (query) => ({ matches: query === '(prefers-color-scheme: dark)' && deviceDark }),
    document: { documentElement: { classList: { add: (c) => classes.add(c) } } },
  });
  return classes.has('dark-theme');
};

for (const route of ['en/software', 'de/home', '.', '404']) {
  test(`THEME-10: on ${route}, the head sets the theme by the site's rule before first paint`, () => {
    const html = page(route);
    assert.deepEqual(
      cases.map((c) => ({ ...c, dark: darkAtFirstPaint(html, c) })),
      cases,
    );
  });
}

// Material has no palette of its own: its colour roles are the glaze's tokens (THEME-17, B1, D9 in
// docs/examples/theme.md), so its components follow the glaze.
const D9 = {
  primary: 'accent',
  secondary: 'accent',
  tertiary: 'accent',
  'surface-tint': 'accent',
  'on-primary': 'on-accent',
  'on-secondary': 'on-accent',
  'on-tertiary': 'on-accent',
  'primary-container': 'azul-wash',
  'secondary-container': 'azul-wash',
  'tertiary-container': 'azul-wash',
  'on-primary-container': 'text-heading',
  'on-secondary-container': 'text-heading',
  'on-tertiary-container': 'text-heading',
  background: 'bg-warm',
  surface: 'bg-warm',
  'surface-bright': 'bg-warm',
  'surface-dim': 'bg-warm',
  'surface-container-lowest': 'bg-white',
  'surface-container-low': 'bg-white',
  'surface-container': 'bg-light',
  'surface-container-high': 'bg-light',
  'surface-container-highest': 'bg-light',
  'surface-variant': 'bg-light',
  'on-background': 'text-body',
  'on-surface': 'text-body',
  'on-surface-variant': 'text-muted',
  outline: 'edge',
  'outline-variant': 'border-light',
  'inverse-surface': 'text-heading',
  'inverse-on-surface': 'bg-warm',
  'inverse-primary': 'azul-wash',
  error: 'ochre-text',
  'on-error': 'bg-light',
  'error-container': 'bg-light',
  'on-error-container': 'ochre-text',
};
const COLOUR_LITERAL = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|light-dark)\(/i;

// Every --mat-sys-* declaration in the built global stylesheet, in order: [name, value].
const matSys = () => {
  const name = readdirSync(browser).find((f) => /^styles-.*\.css$/.test(f));
  const css = readFileSync(join(browser, name), 'utf8');
  return [...css.matchAll(/--mat-sys-([a-z0-9-]+):\s*([^;}]*)/g)].map(([, n, v]) => [n, v.trim()]);
};

test('THEME-17: every colour role of Material is the glaze token of D9', () => {
  const declared = matSys();
  const wrong = Object.entries(D9).flatMap(([role, token]) => {
    const values = declared.filter(([n]) => n === role).map(([, v]) => v);
    const want = `var(--zc-${token})`;
    return values.length > 0 && values.every((v) => v === want) ? [] : [{ role, values, want }];
  });
  assert.deepEqual(wrong, []);
});

test('THEME-19: no file of the built site holds an --mdc- override', () => {
  const files = readdirSync(browser, { recursive: true }).filter((f) => /\.(css|js|html)$/.test(f));
  assert.deepEqual(
    files.filter((f) => readFileSync(join(browser, f), 'utf8').includes('--mdc-')),
    [],
  );
});

test('THEME-17: no --mat-sys-* declaration in the build holds a colour literal', () => {
  const literal = matSys().filter(([, v]) => COLOUR_LITERAL.test(v));
  assert.deepEqual(
    literal.map(([n, v]) => `--mat-sys-${n}: ${v}`),
    [],
  );
});
