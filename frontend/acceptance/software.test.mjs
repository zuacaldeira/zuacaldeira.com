// Acceptance tests for the Software page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/software.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// An element's text as a reader sees it: tags dropped, the entities Angular writes decoded
// (`&` in notation is written `&amp;`), whitespace collapsed.
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const text = (inner) =>
  inner
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity])
    .replace(/\s+/g, ' ')
    .trim();

// The texts of every element with this tag (and, if given, this class), in page order. Angular
// writes its `_ngcontent` attribute before `class`, so the class is looked for anywhere in the tag.
const texts = (html, tag, cls) =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>(.*?)</${tag}>`, 'gs'))]
    .filter(([, attrs]) => !cls || new RegExp(`class="[^"]*\\b${cls}\\b`).test(attrs))
    .map(([, , inner]) => text(inner));

// The page's sections in order, each as its class and inner HTML (sections do not nest here).
const sections = (html) =>
  [...html.matchAll(/<section\b[^>]*class="([^"]*)"[^>]*>(.*?)<\/section>/gs)].map(([, cls, inner]) => ({
    cls,
    inner,
  }));

const lead = (html) => sections(html).find(({ cls }) => cls.split(' ').includes('sw-lead'))?.inner ?? '';

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

test('SW-PAGE-03: the Software page is titled "Alexandre Zua Caldeira — Software" in every language (D9)', () => {
  const titles = LANGS.map((lang) => page(`${lang}/software`).match(/<title>(.*?)<\/title>/)?.[1]);
  assert.deepEqual(titles, Array(3).fill('Alexandre Zua Caldeira — Software'));
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

test('SW-LEAD-01: the first piece after the head is the TDD monitor, told as a case study', () => {
  const html = page('en/software');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 2),
    ['sw-head', 'sw-lead'],
    'the lead does not follow the head',
  );
  assert.deepEqual(
    {
      kicker: texts(lead(html), 'p', 'sw-lead__kicker'),
      title: texts(lead(html), 'h2'),
      status: texts(lead(html), 'p', 'sw-lead__status'),
    },
    {
      kicker: ['Case study · AI agents'],
      title: ['A monitor that holds a coding agent to its TDD protocol'],
      status: ['In use on this site since November 2026'],
    },
  );
});

// The lead's blocks in order: each label (its <h3>) with the texts of its paragraphs.
const blocks = (html) =>
  [...lead(html).matchAll(/<div\b[^>]*class="sw-lead__block"[^>]*>(.*?)<\/div>/gs)].map(([, inner]) => [
    texts(inner, 'h3')[0],
    texts(inner, 'p'),
  ]);

const EN_BLOCKS = [
  [
    'The question',
    [
      'Does a session type make an AI coding agent’s test-driven work better, and in which mode: in pair with the developer, or in batch on an agreed test list? Better means tests that are meaningful for the work, not coverage.',
    ],
  ],
  [
    'What I built',
    [
      'A monitor that watches a TDD agent as it works, through the agent’s hooks, and checks every step against a session type of the TDD workflow: write a test, run it, see it fail for the right reason, make it pass, refactor, commit. Where a type is given, it refuses a step the type does not allow; otherwise it only observes.',
      'It also reports which parts of the target’s own session types the agent’s tests reach: what the software under test must do, failure paths included.',
    ],
  ],
  [
    'The protocol behind it',
    [
      'What the agent does (&{…}) is kept apart from the results it receives (+{…}). The full workflow type has 56 states and 89 transitions and is a lattice, checked with reticulateP. The variants for sabotage (breaking the code on purpose to show a test bites) and for triangulation are subtypes of it.',
    ],
  ],
  [
    'The live view',
    [
      'reticulab serve, a small read-only web app, follows each session live: what is being built, in plain sentences; the agreed test list, N of M done; the target’s coverage; where the agent is in its type; and a slider to replay the steps.',
    ],
  ],
  [
    'The result',
    [
      'In use on this site since November 2026: every element of its header and footer was built test-first by an agent under the monitor, in pair with me.',
    ],
  ],
  ['Stack', ['Python · pytest · Hypothesis · Server-Sent Events · reticulateP']],
];

test('SW-LEAD-02: the case study answers five questions in order, then gives its stack', () => {
  assert.deepEqual(blocks(page('en/software')), EN_BLOCKS);
});

for (const [id, lang, eyebrow, intro] of [
  [
    'SW-HEAD-01',
    'en',
    'Selected work',
    'Software I have built, and how I hold it to its protocol: written down first, checked, then built test-first.',
  ],
  [
    'SW-HEAD-03',
    'pt',
    'Trabalhos selecionados',
    'Software que construí, e como o prendo ao seu protocolo: primeiro escrito, depois verificado, depois construído com os testes primeiro.',
  ],
]) {
  test(`${id}: the ${lang} Software page opens with its eyebrow, one <h1> and the intro`, () => {
    assert.deepEqual(head(page(`${lang}/software`)), { eyebrow: [eyebrow], h1: ['Software'], intro: [intro] });
  });
}
