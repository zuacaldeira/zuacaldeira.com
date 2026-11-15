// Acceptance tests for the About page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/about.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { holding } from './loaded.mjs';
import { menu } from './menu.mjs';

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

test('ABOUT-01: the About page is built in every language, each with its lang and the shared page head', () => {
  const missing = LANGS.filter((lang) => !existsSync(join(browser, lang, 'about', 'index.html')));
  assert.deepEqual(missing, [], 'languages without a built About page');
  const built = LANGS.map((lang) => {
    const html = page(`${lang}/about`);
    return { lang: html.match(/<html lang="([^"]*)"/)?.[1], head: /<app-page-head\b/.test(main(html)) };
  });
  assert.deepEqual(built, LANGS.map((lang) => ({ lang, head: true })));
});

test('ABOUT-02: the browser tab names the About page in its language', () => {
  const titles = LANGS.map((lang) => page(`${lang}/about`).match(/<title>(.*?)<\/title>/)?.[1]);
  assert.deepEqual(titles, [
    'Alexandre Zua Caldeira — About',
    'Alexandre Zua Caldeira — Über mich',
    'Alexandre Zua Caldeira — Sobre',
  ]);
});

test('ABOUT-03: the German About page links to its version in every language, English as default', () => {
  const alternates = [...page('de/about').matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)">/g)].map(
    ([, hreflang, href]) => `${hreflang} ${href}`,
  );
  assert.deepEqual(alternates, [
    'en https://zuacaldeira.com/en/about',
    'de https://zuacaldeira.com/de/about',
    'pt https://zuacaldeira.com/pt/about',
    'x-default https://zuacaldeira.com/en/about',
  ]);
});

test('ABOUT-04: the menu shows Über mich as the page you are on, and only it', () => {
  const links = menu(page('de/about'));
  assert.deepEqual(
    links.filter((link) => link.includes('/de/about') || link.endsWith('(current)')),
    ['Über mich → /de/about (current)'],
  );
});

for (const [id, lang, eyebrow, h1, intro] of [
  [
    'ABOUT-08',
    'en',
    'Piri → Estremoz → Lisbon → Berlin',
    'About',
    'My CV, told as a story: four places, what I learned and did in each, and why I moved on.',
  ],
  [
    'ABOUT-09',
    'pt',
    'Piri → Estremoz → Lisboa → Berlim',
    'Sobre',
    'O meu currículo contado como uma história: quatro lugares, o que aprendi e fiz em cada um, e porque segui em frente.',
  ],
]) {
  test(`${id}: the ${lang} About page opens with the route as eyebrow, one <h1> and the intro`, () => {
    assert.deepEqual(head(page(`${lang}/about`)), { eyebrow: [eyebrow], h1: [h1], intro: [intro] });
  });
}

test('ABOUT-06: the About page downloads its own text, and no other page’s', () => {
  // Its own text is there, so the files read are the ones that hold page text (ASCII sentences).
  const own = 'My CV, told as a story: four places';
  assert.notDeepEqual(holding('en/about', own), []);
  assert.deepEqual(
    {
      home: holding('en/about', 'I build software, and prove its protocols hold.'),
      software: holding('en/about', 'A monitor that holds a coding agent to its TDD protocol'),
      writing: holding('en/about', 'Papers on session types, and on tools that check code against its specification'),
      research: holding('en/about', 'The state space of every well-formed session type forms a lattice.'),
      fromOthers: ['home', 'software', 'writing', 'research'].flatMap((other) => holding(`en/${other}`, own)),
    },
    { home: [], software: [], writing: [], research: [], fromOthers: [] },
  );
});

const attr = (attrs, name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;

// The story's route as built: the <nav>'s name and its stops' links, chapters and places (D8).
const route = (html) =>
  [...main(html).matchAll(/<nav\b([^>]*)>(.*?)<\/nav>/gs)].map(([, attrs, inner]) => ({
    label: attr(attrs, 'aria-label'),
    stops: [...(inner.match(/<ol\b[^>]*>(.*?)<\/ol>/s)?.[1] ?? '').matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].map(
      ([, linkAttrs, body]) => ({
        href: attr(linkAttrs, 'href'),
        // Read directly: the spans sit inside another span, which `texts` would match first.
        chapter: text(body.match(/<span\b[^>]*class="about-route__chapter"[^>]*>(.*?)<\/span>/s)?.[1] ?? ''),
        place: text(body.match(/<span\b[^>]*class="about-route__place"[^>]*>(.*?)<\/span>/s)?.[1] ?? ''),
      }),
    ),
  }));

test('ABOUT-12: beside the story, a <nav> named Der Weg lists the four stops in order, each a link to its chapter', () => {
  const stop = (n, id, place) => ({ href: `/de/about#${id}`, chapter: `Kapitel ${n}`, place });
  assert.deepEqual(route(page('de/about')), [
    {
      label: 'Der Weg',
      stops: [
        stop(1, 'piri', 'Piri'),
        stop(2, 'estremoz', 'Estremoz'),
        stop(3, 'lisbon', 'Lissabon'),
        stop(4, 'berlin', 'Berlin'),
      ],
    },
  ]);
});

test('ABOUT-13: the head’s route and the <nav>’s stops are the same places in the same order', () => {
  const shown = Object.fromEntries(
    LANGS.map((lang) => {
      const html = page(`${lang}/about`);
      return [lang, head(html).eyebrow[0]];
    }),
  );
  const places = Object.fromEntries(
    LANGS.map((lang) => [lang, route(page(`${lang}/about`))[0]?.stops.map((s) => s.place) ?? []]),
  );
  assert.deepEqual(
    Object.values(places).map((stops) => stops.length),
    [4, 4, 4],
    'four stops in every language',
  );
  assert.deepEqual(
    shown,
    Object.fromEntries(LANGS.map((lang) => [lang, places[lang].join(' → ')])),
  );
});

// The chapters as built: each <section> of the story with its id, label and <h2>.
const chapters = (html) =>
  [...main(html).matchAll(/<section\b([^>]*class="about-chapter"[^>]*)>(.*?)<\/section>/gs)].map(
    ([, attrs, inner]) => {
      const [, h2Attrs = '', h2 = ''] = inner.match(/<h2\b([^>]*)>(.*?)<\/h2>/s) ?? [];
      return {
        id: attr(attrs, 'id'),
        labelledBy: attr(attrs, 'aria-labelledby'),
        h2Id: attr(h2Attrs, 'id'),
        place: text(h2),
        label: texts(inner, 'p', 'about-chapter__label'),
      };
    },
  );

test('ABOUT-15 (D11): four chapters in route order, each headed by its place and "Chapter n of 4", no years yet', () => {
  const PLACES = {
    en: ['Piri', 'Estremoz', 'Lisbon', 'Berlin'],
    de: ['Piri', 'Estremoz', 'Lissabon', 'Berlin'],
    pt: ['Piri', 'Estremoz', 'Lisboa', 'Berlim'],
  };
  const OF = { en: (n) => `Chapter ${n} of 4`, de: (n) => `Kapitel ${n} von 4`, pt: (n) => `Capítulo ${n} de 4` };
  const IDS = ['piri', 'estremoz', 'lisbon', 'berlin'];
  assert.deepEqual(
    Object.fromEntries(LANGS.map((lang) => [lang, chapters(page(`${lang}/about`))])),
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        IDS.map((id, i) => ({
          id,
          labelledBy: `h-${id}`,
          h2Id: `h-${id}`,
          place: PLACES[lang][i],
          label: [OF[lang](i + 1)],
        })),
      ]),
    ),
  );
});

test('ABOUT-19: no gap marker from the mock-up reaches a page, nor the files it loads', () => {
  const found = LANGS.flatMap((lang) => {
    const html = main(page(`${lang}/about`));
    return [
      ...['[[', 'gap:'].filter((marker) => text(html).includes(marker)),
      ...['gap', 'ph', 'ann', 'mocknote'].filter((cls) =>
        new RegExp(`class="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?"`).test(html),
      ),
      // In the scripts only the marker's own form: a minified array may hold "[[".
      ...holding(`${lang}/about`, '[[gap').map((file) => `[[gap in ${file}`),
    ].map((what) => `${lang}: ${what}`);
  });
  assert.deepEqual(found, []);
});
