// Acceptance tests for the Writing page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/writing.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

// The shared page head (D13).
const head = (html) => ({
  eyebrow: texts(html, 'p', 'page-head__eyebrow'),
  h1: texts(html, 'h1'),
  intro: texts(html, 'p', 'page-head__intro'),
});

test('WR-HEAD-02: the German Writing page opens in German: eyebrow, one <h1>, the intro', () => {
  const html = page('de/writing');
  assert.match(html, /<html lang="de"/);
  assert.deepEqual(head(html), {
    eyebrow: ['Veröffentlichungen'],
    h1: ['Texte'],
    intro: [
      'Paper über Session-Typen und über Werkzeuge, die Code gegen seine Spezifikation prüfen, die neuesten zuerst. Jeder Eintrag führt dorthin, wo der Text liegt.',
    ],
  });
});
