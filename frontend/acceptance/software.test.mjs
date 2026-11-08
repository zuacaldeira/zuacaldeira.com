// Acceptance tests for the Software page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/software.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

const text = (inner) => inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// The texts of every element with this tag (and, if given, this class), in page order. Angular
// writes its `_ngcontent` attribute before `class`, so the class is looked for anywhere in the tag.
const texts = (html, tag, cls) =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>(.*?)</${tag}>`, 'gs'))]
    .filter(([, attrs]) => !cls || new RegExp(`class="[^"]*\\b${cls}\\b`).test(attrs))
    .map(([, , inner]) => text(inner));

const head = (html) => ({
  eyebrow: texts(html, 'p', 'sw-head__eyebrow'),
  h1: texts(html, 'h1'),
  intro: texts(html, 'p', 'sw-head__intro'),
});

const LANGS = ['en', 'de', 'pt'];

test('SW-PAGE-01: the Software page is built in every language, each with its lang attribute', () => {
  const missing = LANGS.filter((lang) => !existsSync(join(browser, lang, 'software', 'index.html')));
  assert.deepEqual(missing, [], 'languages without a built Software page');
  for (const lang of LANGS) {
    assert.match(page(`${lang}/software`), new RegExp(`<html lang="${lang}"`), `${lang}/software`);
  }
});

test('SW-PAGE-02: the German Software page links to its version in every language, English as default', () => {
  const alternates = [...page('de/software').matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)]
    .map(([, hreflang, href]) => `${hreflang} ${href}`);
  assert.deepEqual(alternates, [
    'en https://zuacaldeira.com/en/software',
    'de https://zuacaldeira.com/de/software',
    'pt https://zuacaldeira.com/pt/software',
    'x-default https://zuacaldeira.com/en/software',
  ]);
});

test('SW-HEAD-02: the German Software page opens in German: eyebrow, one <h1>, the intro', () => {
  const html = page('de/software');
  assert.match(html, /<html lang="de"/);
  assert.deepEqual(head(html), {
    eyebrow: ['Ausgewählte Arbeiten'],
    h1: ['Software'],
    intro: [
      'Software, die ich gebaut habe, und wie ich sie an ihr Protokoll binde: zuerst aufgeschrieben, geprüft, dann testgetrieben gebaut.',
    ],
  });
});
