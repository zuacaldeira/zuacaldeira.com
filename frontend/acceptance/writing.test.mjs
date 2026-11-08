// Acceptance tests for the Writing page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/writing.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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

// SHELL-11: the menu as the developer settled it (2026-11-08); Home and Running leave it (D13 in
// software.md). The home page is no menu item, so nothing in it is current there.
const MENU = {
  en: ['Software', 'Research', 'Writing', 'About'],
  de: ['Software', 'Forschung', 'Texte', 'Über mich'],
  pt: ['Software', 'Investigação', 'Textos', 'Sobre'],
};

test('WR-PAGE-06 (SHELL-11): the menu reads Software, Research, Writing, About, in each language', () => {
  assert.deepEqual(
    Object.fromEntries(LANGS.map((lang) => [lang, menu(page(`${lang}/home`))])),
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        ['software', 'research', 'writing', 'about'].map((p, i) => `${MENU[lang][i]} → /${lang}/${p}`),
      ]),
    ),
  );
});

test('WR-LIST-01 (D3): the four papers follow the head, newest first', () => {
  const html = page('en/writing');
  assert.deepEqual(
    sections(html).map(({ cls }) => cls).slice(0, 2),
    ['page-head', 'wr-texts'],
    'the list does not follow the head',
  );
  assert.deepEqual(items(html).map((item) => texts(item, 'h3')[0]), TITLES);
});

// One text as a reader sees it: each field, and its whole text, so nothing else can hide in it.
const fields = (item) => ({
  year: texts(item, 'span', 'wr-texts__year')[0],
  kind: texts(item, 'span', 'wr-texts__kind')[0],
  title: texts(item, 'h3')[0],
  authors: texts(item, 'p', 'wr-texts__authors')[0],
  self: texts(item, 'b'),
  venue: texts(item, 'p', 'wr-texts__venue')[0],
  note: texts(item, 'p', 'wr-texts__note'),
  link: texts(item, 'a'),
  // Every tag a space here: the fields are separate elements (lines, columns) on the page.
  whole: item.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/ ,/g, ',').trim(),
});

const SELF = ['Alexandre Zua Caldeira', 'Alexandre Z. Caldeira', 'Alexandre Z. Caldeira', 'Alexandre Caldeira'];
const AUTHORS = [
  'Alexandre Zua Caldeira',
  'Simon J. Gay, Vasco T. Vasconcelos, António Ravara, Nils Gesbert, Alexandre Z. Caldeira',
  'Vasco T. Vasconcelos, Simon J. Gay, António Ravara, Nils Gesbert, Alexandre Z. Caldeira',
  'João Abreu, Alexandre Caldeira, Antónia Lopes, Isabel Nunes, Luís S. Reis, Vasco T. Vasconcelos',
];
const VENUES = [
  'ICE 2026 · International Workshop on Interaction and Concurrency Experience',
  'POPL 2010 · ACM SIGPLAN Symposium on Principles of Programming Languages',
  'FOOL 2009 · International Workshop on Foundations of Object-Oriented Languages',
  'DI/FCUL TR-07-7 · Department of Informatics, University of Lisbon',
];
const YEARS = ['2026', '2010', '2009', '2007'];

test('WR-LIST-02, 03, 10 (D4): each English text shows its year, kind, title, authors, venue and link, and nothing else', () => {
  const kinds = ['Workshop paper', 'Conference paper', 'Workshop paper', 'Technical report'];
  const notes = [['Camera-ready · to appear in EPTCS'], [], [], []];
  const links = [
    ['Read (PDF)'],
    ['ACM Digital Library (DOI)↗ (opens in a new tab)'],
    ['eprints.gla.ac.uk↗ (opens in a new tab)'],
    ['repositorio.ulisboa.pt↗ (opens in a new tab)'],
  ];
  const expected = TITLES.map((title, i) => {
    const shown = { year: YEARS[i], kind: kinds[i], title, authors: AUTHORS[i], venue: VENUES[i], note: notes[i] };
    return {
      ...shown,
      self: [SELF[i]],
      link: links[i],
      whole: [shown.year, shown.kind, title, shown.authors, shown.venue, ...shown.note, ...links[i]]
        .join(' ')
        .replace('↗', ' ↗'),
    };
  });
  assert.deepEqual(items(page('en/writing')).map(fields), expected);
});

test('WR-LIST-04: only the ICE paper has a note, in the page language: camera-ready, to appear in EPTCS', () => {
  const notes = Object.fromEntries(
    LANGS.map((lang) => [lang, items(page(`${lang}/writing`)).map((item) => fields(item).note)]),
  );
  assert.deepEqual(notes, {
    en: [['Camera-ready · to appear in EPTCS'], [], [], []],
    de: [['Druckfassung · erscheint in EPTCS'], [], [], []],
    pt: [['Versão final · a publicar na EPTCS'], [], [], []],
  });
});

// A text's links: each attribute a test reads, its visible label, and its hidden words.
const attr = (attrs, name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;
const linksOf = (item) =>
  [...item.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].map(([, attrs, inner]) => ({
    label: text(inner.replace(/<span\b[^>]*>.*?<\/span>/gs, '')),
    href: attr(attrs, 'href'),
    target: attr(attrs, 'target'),
    rel: attr(attrs, 'rel'),
    type: attr(attrs, 'type'),
    hreflang: attr(attrs, 'hreflang'),
    arrow: texts(inner, 'span', 'wr-texts__arrow').length ? /aria-hidden="true"[^>]*>↗</.test(inner) : null,
    hidden: texts(inner, 'span', 'visually-hidden')[0] ?? null,
  }));

const PDF = '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf';

test('WR-LIST-05: the ICE paper opens as a PDF from this site, in this tab, in every language', () => {
  const read = { en: 'Read (PDF)', de: 'Lesen (PDF)', pt: 'Ler (PDF)' };
  const links = Object.fromEntries(LANGS.map((lang) => [lang, linksOf(items(page(`${lang}/writing`))[0])]));
  assert.deepEqual(
    links,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        [{ label: read[lang], href: PDF, target: null, rel: null, type: 'application/pdf', hreflang: 'en', arrow: null, hidden: null }],
      ]),
    ),
  );
  assert.ok(existsSync(join(browser, PDF)), 'the paper is not in the build');
});

test('WR-LIST-06: the older papers link to where they are published, in a new tab, and say so in the page language', () => {
  const newTab = { en: 'opens in a new tab', de: 'öffnet in einem neuen Tab', pt: 'abre num novo separador' };
  const OUT = [
    ['ACM Digital Library (DOI)', 'https://doi.org/10.1145/1706299.1706335'],
    ['eprints.gla.ac.uk', 'https://eprints.gla.ac.uk/47911/'],
    ['repositorio.ulisboa.pt', 'https://repositorio.ulisboa.pt/handle/10451/14164'],
  ];
  const links = Object.fromEntries(
    LANGS.map((lang) => [lang, items(page(`${lang}/writing`)).slice(1).map(linksOf)]),
  );
  assert.deepEqual(
    links,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        OUT.map(([label, href]) => [
          {
            label,
            href,
            target: '_blank',
            rel: 'noopener noreferrer',
            type: null,
            hreflang: 'en',
            arrow: true,
            hidden: `(${newTab[lang]})`,
          },
        ]),
      ]),
    ),
  );
});

// What a text keeps in every language, and how its title is marked (D10, WR-LIST-07 to 09).
const published = (item) => {
  const { year, title, authors, self, venue } = fields(item);
  return { year, title, authors, self, venue, targets: linksOf(item).map(({ href }) => href) };
};
const marked = (item) => {
  const h3 = item.match(/<h3\b([^>]*)>/)?.[1] ?? '';
  return {
    kind: fields(item).kind,
    lang: attr(h3, 'lang'),
    translate: attr(h3, 'translate'),
    inEnglish: texts(item, 'p', 'wr-texts__lang'),
  };
};

test('WR-LIST-07, 08, 09 (D10): the labels are translated, the titles, names and venues stay as published', () => {
  const english = items(page('en/writing')).map(published);
  const shown = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      { published: items(page(`${lang}/writing`)).map(published), marked: items(page(`${lang}/writing`)).map(marked) },
    ]),
  );
  const markedAs = (kinds, lang, inEnglish) =>
    kinds.map((kind) => ({ kind, lang, translate: 'no', inEnglish: inEnglish ? [inEnglish] : [] }));
  assert.deepEqual(shown, {
    en: {
      published: english,
      marked: markedAs(['Workshop paper', 'Conference paper', 'Workshop paper', 'Technical report'], null, null),
    },
    de: {
      published: english,
      marked: markedAs(['Workshop-Paper', 'Konferenz-Paper', 'Workshop-Paper', 'Technischer Bericht'], 'en', 'Auf Englisch'),
    },
    pt: {
      published: english,
      marked: markedAs(
        ['Artigo de workshop', 'Artigo de conferência', 'Artigo de workshop', 'Relatório técnico'],
        'en',
        'Em inglês',
      ),
    },
  });
  assert.deepEqual(english.map(({ title }) => title), TITLES);
});

test('WR-LIST-11 (D2): the training papers are not on the Writing page, in any language', () => {
  const training = [
    'Schriftliche Reflexion — Berufliche Identität',
    'Bronfenbrenner — Lebenswelten und Diversität',
    'Filmzusammenfassung — Anthroposophie',
    'reflexion-berufliche-identitaet.pdf',
    'bronfenbrenner-lebenswelten.pdf',
    'filmzusammenfassung-anthroposophie',
  ];
  const found = LANGS.flatMap((lang) =>
    training.filter((name) => page(`${lang}/writing`).includes(name)).map((name) => `${lang}: ${name}`),
  );
  assert.deepEqual(found, []);
});

test('WR-LIST-10 (D4): no abstract is on the Writing page, in any language', () => {
  const abstracts = [
    'We prove that the state space of every well-formed session type',
    'Session types allow communication protocols to be specified type-theoretically',
    'We define a small class-based object-oriented language',
    'ConGu is a tool that supports the checking of Java classes',
  ];
  const found = LANGS.flatMap((lang) =>
    abstracts.filter((sentence) => text(page(`${lang}/writing`)).includes(sentence)).map((s) => `${lang}: ${s}`),
  );
  assert.deepEqual(found, []);
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
