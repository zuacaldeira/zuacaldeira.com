// Acceptance tests for the About page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/about.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

const LANGS = ['en', 'de', 'pt'];

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

// The page's own content: its <main>, without the shell around it.
const main = (html) => html.match(/<main\b[^>]*>(.*?)<\/main>/s)?.[1] ?? '';

// The shared page head (D13 in writing.md).
const head = (html) => ({
  eyebrow: texts(html, 'p', 'page-head__eyebrow'),
  h1: texts(html, 'h1'),
  intro: texts(html, 'p', 'page-head__intro'),
});

test('ABOUT-09: the German About page opens in German: the route as eyebrow, one <h1>, the intro', () => {
  const html = page('de/about');
  assert.match(html, /<html lang="de"/);
  assert.deepEqual(head(html), {
    eyebrow: ['Piri → Estremoz → Lissabon → Berlin'],
    h1: ['Über mich'],
    intro: [
      'Mein Lebenslauf als Geschichte: vier Orte, was ich an jedem gelernt und getan habe, und warum ich weitergezogen bin.',
    ],
  });
});

// The old page's headings (ABOUT-07); "Der Weg" and "O percurso" only as headings, since the new
// route is named so.
const OLD_HEADINGS = [
  'The Journey',
  'Berlin Chapter',
  'Beyond Work',
  'Der Weg',
  'Berliner Kapitel',
  'Neben der Arbeit',
  'O percurso',
  'Capítulo Berlim',
  'Para além do trabalho',
];

test('ABOUT-07: the old page is gone: no section header, no old heading, no <strong>', () => {
  const found = LANGS.flatMap((lang) => {
    const html = main(page(`${lang}/about`));
    const headings = ['h1', 'h2', 'h3'].flatMap((tag) => texts(html, tag));
    return [
      ...(/<app-section-header\b/.test(html) ? ['app-section-header'] : []),
      ...OLD_HEADINGS.filter((old) => headings.includes(old)),
      ...(/<strong\b/.test(html) ? ['<strong>'] : []),
    ].map((what) => `${lang}: ${what}`);
  });
  assert.deepEqual(found, []);
});
