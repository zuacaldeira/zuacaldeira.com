// Acceptance tests for the shell every page shares, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/shell.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// Every built page with its language; `/` and the 404 page are English (D1 in home.md, SHELL-09).
const PAGES = [
  ...['en', 'de', 'pt'].flatMap((lang) =>
    ['home', 'about', 'research', 'running', 'contact'].map((name) => [`${lang}/${name}`, lang]),
  ),
  ['.', 'en'],
  ['404', 'en'],
];

// Links inside the site: an `<a href>` that starts with `/`. Links to files (with an extension,
// such as the paper's PDF) are not pages.
const siteLinks = (html) =>
  [...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)[^"]*"/g)]
    .map(([, href]) => href)
    .filter((href) => !/\.[a-z0-9]+$/i.test(href));

test('SHELL-04: every link inside the site on every built page keeps its language and is a page of the build', () => {
  const wrong = PAGES.flatMap(([route, lang]) =>
    siteLinks(page(route))
      .filter(
        (href) =>
          !new RegExp(`^/${lang}/[a-z-]+$`).test(href) ||
          !existsSync(join(browser, href, 'index.html')),
      )
      .map((href) => `${route} → ${href}`),
  );
  assert.deepEqual([...new Set(wrong)], []);
});
