// Acceptance tests for the Writing page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/writing.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { holding } from './loaded.mjs';

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

const LANGS = ['en', 'de', 'pt'];

// The page's sections, by class, in page order.
const sections = (html) =>
  [...html.matchAll(/<section\b[^>]*class="([^"]*)"[^>]*>(.*?)<\/section>/gs)].map(([, cls, inner]) => ({
    cls,
    inner,
  }));

// The list (D14): its texts, each <li> of its <ul>.
const list = (html) => sections(html).find(({ cls }) => cls.split(' ').includes('wr-texts'))?.inner ?? '';
const items = (html) => [...list(html).matchAll(/<li\b[^>]*>(.*?)<\/li>/gs)].map(([, inner]) => inner);

const TITLES = [
  'Session Type State Spaces Form Lattices',
  'Modular Session Types for Distributed Object-Oriented Programming',
  'Dynamic Interfaces',
  'ConGu, Checking Java Classes Against Property-Driven Algebraic Specifications',
];

test('WR-LIST-01 (D3): the four papers follow the head, newest first', () => {
  const html = page('en/writing');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 2),
    ['page-head', 'wr-texts'],
    'the list does not follow the head',
  );
  assert.deepEqual(items(html).map((item) => texts(item, 'h3')[0]), TITLES);
});

test('WR-PAGE-01: the Writing page is built in every language, each with its lang attribute', () => {
  const missing = LANGS.filter((lang) => !existsSync(join(browser, lang, 'writing', 'index.html')));
  assert.deepEqual(missing, [], 'languages without a built Writing page');
  for (const lang of LANGS) {
    assert.match(page(`${lang}/writing`), new RegExp(`<html lang="${lang}"`), `${lang}/writing`);
  }
});

test('WR-PAGE-02: the German Writing page links to its version in every language, English as default', () => {
  const alternates = [...page('de/writing').matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)]
    .map(([, hreflang, href]) => `${hreflang} ${href}`);
  assert.deepEqual(alternates, [
    'en https://zuacaldeira.com/en/writing',
    'de https://zuacaldeira.com/de/writing',
    'pt https://zuacaldeira.com/pt/writing',
    'x-default https://zuacaldeira.com/en/writing',
  ]);
});

test('WR-PAGE-03: the browser tab names the Writing page in its language', () => {
  const titles = LANGS.map((lang) => page(`${lang}/writing`).match(/<title>(.*?)<\/title>/)?.[1]);
  assert.deepEqual(titles, [
    'Alexandre Zua Caldeira — Writing',
    'Alexandre Zua Caldeira — Texte',
    'Alexandre Zua Caldeira — Textos',
  ]);
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

for (const [id, lang, eyebrow, h1, intro] of [
  [
    'WR-HEAD-01',
    'en',
    'Published work',
    'Writing',
    'Papers on session types, and on tools that check code against its specification, newest first. Each one links to where the text lives.',
  ],
  [
    'WR-HEAD-03',
    'pt',
    'Publicações',
    'Textos',
    'Artigos sobre tipos de sessão e sobre ferramentas que verificam o código face à sua especificação, os mais recentes primeiro. Cada um leva ao sítio onde o texto está.',
  ],
]) {
  test(`${id}: the ${lang} Writing page opens with its eyebrow, one <h1> and the intro`, () => {
    assert.deepEqual(head(page(`${lang}/writing`)), { eyebrow: [eyebrow], h1: [h1], intro: [intro] });
  });
}

test('WR-PAGE-10 (D20 in software.md): the Writing page downloads only its own text', () => {
  // Its own text is there, so the files read are the ones that hold page text (ASCII sentences).
  const own = 'Papers on session types, and on tools that check code against its specification, newest first.';
  assert.notDeepEqual(holding('en/writing', own), []);
  assert.deepEqual(
    {
      home: holding('en/writing', 'I build software, and prove its protocols hold.'),
      software: holding('en/writing', 'A monitor that holds a coding agent to its TDD protocol'),
      fromHome: holding('en/home', own),
    },
    { home: [], software: [], fromHome: [] },
  );
});
