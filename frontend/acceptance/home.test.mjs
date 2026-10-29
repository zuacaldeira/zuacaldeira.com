// Acceptance tests for the home page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/home.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// A failure names the missing fragment, not the whole page (fonts are inlined, ~270 kB).
function contains(html, fragment, route) {
  assert.ok(html.includes(fragment), `${route} lacks ${fragment}`);
}

test('HOME-PAGE-01: each language has its own home page with its lang attribute', () => {
  for (const lang of ['en', 'de', 'pt']) {
    contains(page(`${lang}/home`), `<html lang="${lang}"`, `${lang}/home`);
  }
});

test('HOME-PAGE-02: the German home links to every language version', () => {
  const html = page('de/home');
  for (const [hreflang, path] of [
    ['en', 'en/home'],
    ['de', 'de/home'],
    ['pt', 'pt/home'],
    ['x-default', 'en/home'],
  ]) {
    contains(
      html,
      `<link rel="alternate" hreflang="${hreflang}" href="https://zuacaldeira.com/${path}">`,
      'de/home',
    );
  }
});

test('HOME-PAGE-03: the home page title is the name and the tagline in its language', () => {
  for (const [lang, title] of [
    ['pt', 'Alexandre Caldeira — Investigador. Programador. Educador. Corredor.'],
    ['en', 'Alexandre Caldeira — Researcher. Developer. Educator. Runner.'],
    ['de', 'Alexandre Caldeira — Forscher. Entwickler. Erzieher. Läufer.'],
  ]) {
    contains(page(`${lang}/home`), `<title>${title}</title>`, `${lang}/home`);
  }
});

test('HOME-PAGE-04: the site root is the English home, linked to the German and Portuguese', () => {
  const html = page('.');
  contains(html, '<html lang="en"', 'index.html');
  contains(html, '<title>Alexandre Caldeira — Researcher. Developer. Educator. Runner.</title>', 'index.html');
  contains(html, 'Researcher. Developer. Educator. Runner.</p>', 'index.html');
  for (const lang of ['de', 'pt']) {
    contains(
      html,
      `<link rel="alternate" hreflang="${lang}" href="https://zuacaldeira.com/${lang}/home">`,
      'index.html',
    );
  }
});
