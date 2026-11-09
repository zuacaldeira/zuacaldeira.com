// Acceptance tests for the Research page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/research.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// An element's text as a reader sees it: tags dropped, whitespace collapsed.
const text = (inner) =>
  inner
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// The texts of every element with this tag (and, if given, this class), in page order.
const texts = (html, tag, cls) =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>(.*?)</${tag}>`, 'gs'))]
    .filter(([, attrs]) => !cls || new RegExp(`class="[^"]*\\b${cls}\\b`).test(attrs))
    .map(([, , inner]) => text(inner));

// The shared page head (D13 in writing.md).
const head = (html) => ({
  eyebrow: texts(html, 'p', 'page-head__eyebrow'),
  h1: texts(html, 'h1'),
  intro: texts(html, 'p', 'page-head__intro'),
});

// The page's own content: its <main>, without the shell around it.
const main = (html) => html.match(/<main\b[^>]*>(.*?)<\/main>/s)?.[1] ?? '';

// The old page (D7): its list of publications and its Material cards and buttons.
const OLD = [
  'Publications',
  'Publikationen',
  'Publicações',
  'Modular Session Types for Distributed Object-Oriented Programming',
  'Dynamic Interfaces',
  'ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications',
  'Session types allow communication protocols to be specified type-theoretically',
  'We define a small class-based object-oriented language',
  'ConGu is a tool that supports the checking of Java classes',
];
const MATERIAL = [/<mat-card\b/, /\smat-button\b/, /\smat-stroked-button\b/];

test('RS-PAGE-07 (D7): the old page is gone: no list of publications, no Material cards or buttons', () => {
  const found = ['en', 'de', 'pt'].flatMap((lang) => {
    const html = main(page(`${lang}/research`));
    return [
      ...OLD.filter((words) => text(html).includes(words)),
      ...MATERIAL.filter((tag) => tag.test(html)).map(String),
    ].map((found) => `${lang}: ${found}`);
  });
  assert.deepEqual(found, []);
});

const LANGS = ['en', 'de', 'pt'];

test('RS-PAGE-01: the Research page is built in every language, each with its lang and the shared page head', () => {
  const missing = LANGS.filter((lang) => !existsSync(join(browser, lang, 'research', 'index.html')));
  assert.deepEqual(missing, [], 'languages without a built Research page');
  const built = LANGS.map((lang) => {
    const html = page(`${lang}/research`);
    return { lang: html.match(/<html lang="([^"]*)"/)?.[1], head: /<app-page-head\b/.test(main(html)) };
  });
  assert.deepEqual(built, LANGS.map((lang) => ({ lang, head: true })));
});

test('RS-HEAD-02: the German Research page opens in German: eyebrow, one <h1>, the intro', () => {
  const html = page('de/research');
  assert.match(html, /<html lang="de"/);
  assert.deepEqual(head(html), {
    eyebrow: ['Ein Paper · ICE 2026'],
    h1: ['Forschung'],
    intro: [
      'Der Zustandsraum jedes wohlgeformten Session-Typs bildet einen Verband. Diese Seite stellt das Paper vor, das es beweist: was es zeigt, wie es geprüft wurde und das Werkzeug dahinter.',
    ],
  });
});
