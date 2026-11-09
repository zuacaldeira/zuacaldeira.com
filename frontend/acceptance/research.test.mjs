// Acceptance tests for the Research page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/research.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { holding } from './loaded.mjs';
import { menu } from './menu.mjs';

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

for (const [id, lang, eyebrow, h1, intro] of [
  [
    'RS-HEAD-01',
    'en',
    'One paper · ICE 2026',
    'Research',
    'The state space of every well-formed session type forms a lattice. This page is the paper that proves it: what it shows, how it was checked, and the tool behind it.',
  ],
  [
    'RS-HEAD-03',
    'pt',
    'Um artigo · ICE 2026',
    'Investigação',
    'O espaço de estados de todo o tipo de sessão bem formado forma um reticulado. Esta página apresenta o artigo que o prova: o que mostra, como foi verificado e a ferramenta por trás dele.',
  ],
]) {
  test(`${id}: the ${lang} Research page opens with its eyebrow, one <h1> and the intro`, () => {
    assert.deepEqual(head(page(`${lang}/research`)), { eyebrow: [eyebrow], h1: [h1], intro: [intro] });
  });
}

test('RS-PAGE-02: the browser tab names the Research page in its language', () => {
  const titles = LANGS.map((lang) => page(`${lang}/research`).match(/<title>(.*?)<\/title>/)?.[1]);
  assert.deepEqual(titles, [
    'Alexandre Zua Caldeira — Research',
    'Alexandre Zua Caldeira — Forschung',
    'Alexandre Zua Caldeira — Investigação',
  ]);
});

test('RS-PAGE-03: the German Research page links to its version in every language, English as default', () => {
  const alternates = [...page('de/research').matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)]
    .map(([, hreflang, href]) => `${hreflang} ${href}`);
  assert.deepEqual(alternates, [
    'en https://zuacaldeira.com/en/research',
    'de https://zuacaldeira.com/de/research',
    'pt https://zuacaldeira.com/pt/research',
    'x-default https://zuacaldeira.com/en/research',
  ]);
});

test('RS-PAGE-06 (D11): the Research page downloads its own text, and no other page’s', () => {
  // Its own text is there, so the files read are the ones that hold page text (ASCII sentences).
  const own = 'The state space of every well-formed session type forms a lattice.';
  assert.notDeepEqual(holding('en/research', own), []);
  assert.deepEqual(
    {
      home: holding('en/research', 'I build software, and prove its protocols hold.'),
      software: holding('en/research', 'A monitor that holds a coding agent to its TDD protocol'),
      writing: holding('en/research', 'Papers on session types, and on tools that check code against its specification'),
      fromHome: holding('en/home', own),
    },
    { home: [], software: [], writing: [], fromHome: [] },
  );
});

// The sections of a page's <main>, by their first class, in page order.
const sections = (inner) =>
  [...inner.matchAll(/<section\b[^>]*class="([^"]*)"/g)].map(([, cls]) => cls.split(' ')[0]);

test('RS-PAGE-08 (D1): no "What\'s next" while it has no text; the sections so far are the head alone', () => {
  const next = ["What's next", 'What’s next', 'Wie es weitergeht', 'O que vem a seguir'];
  const shown = Object.fromEntries(
    LANGS.map((lang) => {
      const html = main(page(`${lang}/research`));
      return [lang, { sections: sections(html), next: next.filter((words) => text(html).includes(words)) }];
    }),
  );
  // Slices 2 to 4 add the paper, what it proves, how it was checked, the tool and more research.
  assert.deepEqual(shown, Object.fromEntries(LANGS.map((lang) => [lang, { sections: ['page-head'], next: [] }])));
});

// The wall's data (D8): the distinct lattices at rung R2′, in render.py's order (states, then edges).
const LATTICES = JSON.parse(
  readFileSync(join(import.meta.dirname, '../scripts/lattice-wall/lattices.json'), 'utf8'),
).toSorted((a, b) => a.n - b.n || a.e - b.e);

// The page head's parts after the intro, and the wall's tiles: each `g` with its classes and name.
const afterIntro = (html) => main(html).split(/<p\b[^>]*class="page-head__intro"[^>]*>.*?<\/p>/s)[1] ?? '';
const figures = (html) => [...afterIntro(html).matchAll(/<figure\b[^>]*>(.*?)<\/figure>/gs)].map(([, inner]) => inner);
const tiles = (inner) =>
  [...inner.matchAll(/<g\b([^>]*)>/g)].map(([, attrs]) => ({
    cls: attrs.match(/\sclass="([^"]*)"/)?.[1] ?? '',
    name: attrs.match(/\sdata-name="([^"]*)"/)?.[1] ?? null,
  }));

test('RS-WALL-01 (D8): after the intro, one figure shows the 74 lattices in order, the 47 not distributive marked', () => {
  const found = figures(page('en/research'));
  assert.equal(found.length, 1, 'one figure after the intro');
  const svg = found[0].match(/<svg\b([^>]*)>/)?.[1] ?? '';
  const shown = tiles(found[0]);
  assert.deepEqual(
    {
      role: svg.match(/\srole="([^"]*)"/)?.[1],
      names: shown.map(({ name }) => name),
      notDistributive: shown.filter(({ cls }) => cls.split(' ').includes('nd')).length,
      tiles: shown.filter(({ cls }) => cls.split(' ').includes('t')).length,
    },
    {
      role: 'img',
      names: LATTICES.map(({ name }) => name),
      notDistributive: 47,
      tiles: 74,
    },
  );
});

// The wall's words on a built page: the SVG's label, the caption, and the hint as prerendered.
const wallWords = (html) => {
  const figure = figures(html)[0] ?? '';
  return {
    label: figure.match(/<svg\b[^>]*\saria-label="([^"]*)"/)?.[1] ?? null,
    caption: texts(figure, 'figcaption')[0] ?? null,
    hint: texts(figure, 'p')[0] ?? null,
  };
};

test('RS-WALL-02: the German wall says what it is and which construction it draws', () => {
  const { label, caption } = wallWords(page('de/research'));
  assert.deepEqual(
    {
      label,
      caption,
      labelNames: ['R2′', '74'].filter((words) => label?.includes(words)),
      captionNames: ['R2′', '74', '104', '108', '47'].filter((words) => caption?.includes(words)),
    },
    {
      label:
        'Die 74 verschiedenen Verbände der Benchmark-Protokolle des Papers auf Stufe R2′, nach Größe geordnet; die 47 nicht distributiven in Ocker.',
      caption:
        '74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf Stufe R2′, einer feineren Konstruktion als der des Papers. Ocker: nicht distributiv, 47 der 74.',
      labelNames: ['R2′', '74'],
      captionNames: ['R2′', '74', '104', '108', '47'],
    },
  );
});

test('RS-WALL-04: each tile carries its protocol’s name as published, the same in every language', () => {
  const names = Object.fromEntries(
    LANGS.map((lang) => [lang, tiles(figures(page(`${lang}/research`))[0] ?? '').map(({ name }) => name)]),
  );
  assert.deepEqual(
    { first: names.en[0], last: names.en.at(-1), count: names.en.length, de: names.de, pt: names.pt },
    { first: 'GoF Facade', last: 'Raft Leader Election', count: 74, de: names.en, pt: names.en },
  );
});

// The classes the head's inline scripts put on <html> before first paint, run as theme.test.mjs runs
// them, on a device that does or does not ask for reduced motion.
const htmlClassesAtFirstPaint = (html, { reducedMotion }) => {
  const classes = new Set();
  const scripts = [...(html.match(/<head>(.*?)<\/head>/s)?.[1] ?? '').matchAll(/<script>(.*?)<\/script>/gs)];
  runInNewContext(scripts.map(([, code]) => code).join(';\n'), {
    localStorage: { getItem: () => 'light' },
    matchMedia: (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion }),
    document: { documentElement: { classList: { add: (c) => classes.add(c) } } },
  });
  return [...classes];
};

test('RS-MOTION-01, 02 (D13): before first paint, <html> gets motion unless the device asks for reduced motion', () => {
  const html = page('en/research');
  assert.deepEqual(
    {
      allowed: htmlClassesAtFirstPaint(html, { reducedMotion: false }),
      reduced: htmlClassesAtFirstPaint(html, { reducedMotion: true }),
    },
    { allowed: ['motion'], reduced: [] },
  );
});

test('RS-PAGE-04 (D34 in software.md): the menu shows Forschung as the page you are on, and only it', () => {
  const links = menu(page('de/research'));
  assert.deepEqual(
    links.filter((link) => link.includes('/de/research') || link.endsWith('(current)')),
    ['Forschung → /de/research (current)'],
  );
});
