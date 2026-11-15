// Acceptance tests for the site's logo in the header, read from the prerendered build (the desktop
// bar; the phone bar exists only after Angular starts). Run `npm run build` first, then
// `npm run acceptance`. Examples: docs/examples/logo.md, slice 1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// Every built page with its language; `/` and the 404 page are English (as PAGES in shell.test.mjs).
const PAGES = [
  ...['en', 'de', 'pt'].flatMap((lang) =>
    ['home', 'about', 'software', 'research', 'writing', 'running', 'contact'].map((name) => [
      `${lang}/${name}`,
      lang,
    ]),
  ),
  ['.', 'en'],
  ['404', 'en'],
];

const header = (html) => html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? '';
const text = (html) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// The header's home links, each as its href, whether it holds a hidden SVG, and its visible text.
const logos = (html) =>
  [...header(html).matchAll(/<a\b([^>]*\sclass="[^"]*\blogo\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/g)].map(
    ([, attrs, inner]) => ({
      href: attrs.match(/\shref="([^"]*)"/)?.[1],
      name: attrs.match(/\saria-label="([^"]*)"/)?.[1],
      mark: /<svg\b[^>]*\saria-hidden="true"/.test(inner),
      text: text(inner),
      untranslated: [...inner.matchAll(/<span\b([^>]*)>([^<]*)<\/span>/g)]
        .filter(([, spanAttrs]) => /\stranslate="no"/.test(spanAttrs))
        .map(([, , name]) => name.trim()),
    }),
  );

test('LOGO-01: the header of /de/home shows the diamond and "Zua Caldeira", linking to /de/home, and no "zc"', () => {
  const html = page('de/home');
  assert.deepEqual(
    {
      logos: logos(html).map(({ href, mark, text }) => ({ href, mark, text })),
      zc: text(header(html)).split(' ').includes('zc'),
    },
    {
      logos: [{ href: '/de/home', mark: true, text: 'Zua Caldeira' }],
      zc: false,
    },
  );
});

test('LOGO-02 (D5): on every built page the home link is named "Alexandre Zua Caldeira", in every language', () => {
  const names = Object.fromEntries(
    PAGES.map(([route]) => [route, logos(page(route)).map(({ name }) => name)]),
  );
  const expected = Object.fromEntries(PAGES.map(([route]) => [route, ['Alexandre Zua Caldeira']]));
  assert.deepEqual(names, expected);
});

test('LOGO-11: on every built page the name reads "Zua Caldeira", marked never to be translated', () => {
  const names = Object.fromEntries(
    PAGES.map(([route]) => [route, logos(page(route)).map(({ untranslated }) => untranslated)]),
  );
  const expected = Object.fromEntries(PAGES.map(([route]) => [route, [['Zua Caldeira']]]));
  assert.deepEqual(names, expected);
});
