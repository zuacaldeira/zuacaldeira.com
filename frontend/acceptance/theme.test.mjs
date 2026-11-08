// Acceptance tests for the theme at first paint, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: THEME-10 in docs/examples/theme.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
