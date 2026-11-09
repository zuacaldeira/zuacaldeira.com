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
  // D18: and the paper's shared text, which the card and the results read (shared/paper.evidence).
  const shared = 'Checked on 108 benchmark protocols from networking, databases, distributed systems and AI.';
  assert.notDeepEqual(holding('en/research', shared), [], 'the shared paper text is not loaded');
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

test('RS-PAGE-08 (D1): no "What\'s next"; the sections are head, paper, results, checks, tool, more', () => {
  const next = ["What's next", 'What’s next', 'Wie es weitergeht', 'O que vem a seguir'];
  const shown = Object.fromEntries(
    LANGS.map((lang) => {
      const html = main(page(`${lang}/research`));
      return [lang, { sections: sections(html), next: next.filter((words) => text(html).includes(words)) }];
    }),
  );
  const ORDER = ['page-head', 'rs-paper', 'rs-results', 'rs-checks', 'rs-tool', 'rs-more'];
  assert.deepEqual(shown, Object.fromEntries(LANGS.map((lang) => [lang, { sections: ORDER, next: [] }])));
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

test('RS-WALL-07 (D17): the German caption ends with its key, in a span of its own', () => {
  const figcaption = (figures(page('de/research'))[0] ?? '').match(/<figcaption\b[^>]*>(.*?)<\/figcaption>/s)?.[1] ?? '';
  const parts = figcaption.split(/(<span\b[^>]*class="rs-wall__key"[^>]*>.*?<\/span>)/s);
  assert.deepEqual(
    { caption: text(parts[0] ?? ''), key: texts(figcaption, 'span', 'rs-wall__key'), after: text(parts[2] ?? '') },
    {
      caption:
        '74 verschiedene Verbände, gezeichnet aus 104 der 108 Protokolle des Papers auf Stufe R2′, einer feineren Konstruktion als der des Papers.',
      key: ['Ocker: nicht distributiv, 47 der 74.'],
      after: '',
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

// The wall's counts, computed from the data (D9; scripts/lattice-wall/README.md): classes and
// protocols, never mixed. 108 is the paper's own corpus, of which the data covers 104.
const COUNTS = {
  classes: LATTICES.length,
  notDistributive: LATTICES.filter((o) => !o.dist).length,
  protocols: LATTICES.reduce((sum, o) => sum + o.count, 0),
  protocolsNotDistributive: LATTICES.filter((o) => !o.dist).reduce((sum, o) => sum + o.count, 0),
};
const PAPER_PROTOCOLS = 108;
// The numbers a reader sees in a text, in any order; "R2′" names the rung, it is no count.
const numbersIn = (words) => (words ?? '').replaceAll('R2′', '').match(/\d+/g)?.map(Number).toSorted((a, b) => a - b) ?? [];

test('RS-WALL-06 (D9, D16): every number in the wall’s label and caption is the data’s, in every language', () => {
  assert.deepEqual(COUNTS, { classes: 74, notDistributive: 47, protocols: 104, protocolsNotDistributive: 50 });
  const { classes, notDistributive, protocols } = COUNTS;
  const sorted = (...numbers) => numbers.toSorted((a, b) => a - b);
  assert.deepEqual(
    Object.fromEntries(
      LANGS.map((lang) => {
        const { label, caption } = wallWords(page(`${lang}/research`));
        return [lang, { label: numbersIn(label), caption: numbersIn(caption) }];
      }),
    ),
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        {
          label: sorted(classes, notDistributive),
          caption: sorted(classes, protocols, PAPER_PROTOCOLS, notDistributive, classes),
        },
      ]),
    ),
  );
});

// The CSS rules in a page's <style> elements that hide the wall's lines or states: a selector on
// `.draw` with a dash offset of 1 or no opacity.
const hidingRules = (html) =>
  [...html.matchAll(/<style\b[^>]*>(.*?)<\/style>/gs)]
    .flatMap(([, css]) => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)])
    .filter(([, selector, body]) => /\.draw\b/.test(selector) && /stroke-dashoffset:1\b|opacity:0\b/.test(body))
    .map(([, selector]) => selector.trim());

test('RS-MOTION-03, RS-MOTION-P-03: without a script the wall is complete and the hint says nothing', () => {
  const html = page('en/research');
  const rules = hidingRules(html);
  assert.ok(rules.length >= 2, `the rules that hide lines and states are read: ${JSON.stringify(rules)}`);
  assert.deepEqual(
    {
      tiles: tiles(figures(html)[0] ?? '').length,
      unconditional: rules.flatMap((rule) => rule.split(',')).filter((sel) => !/^\s*html\.motion\b/.test(sel)),
      hint: wallWords(html).hint,
    },
    { tiles: 74, unconditional: [], hint: '' },
  );
});

// The paper's own count (its abstract): 93 distributive, 15 not, of 108; the wall's are COUNTS.
const PAPER = { distributive: 93, notDistributive: 15 };

test('RS-WALL-06 (D16): every number in the rung note is the paper’s or the data’s, 50 included, in every language', () => {
  const { classes, notDistributive, protocols, protocolsNotDistributive } = COUNTS;
  const expected = [
    PAPER.distributive,
    PAPER.notDistributive,
    PAPER_PROTOCOLS,
    notDistributive,
    classes,
    protocolsNotDistributive,
    protocols,
  ].toSorted((a, b) => a - b);
  assert.deepEqual(
    Object.fromEntries(LANGS.map((lang) => [lang, numbersIn(checks(page(`${lang}/research`)).after[1])])),
    Object.fromEntries(LANGS.map((lang) => [lang, expected])),
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

// A section of <main> by its first class, with what it holds.
const section = (html, cls) =>
  [...main(html).matchAll(/<section\b[^>]*class="([^"]*)"[^>]*>(.*?)<\/section>/gs)].find(
    ([, classes]) => classes.split(' ')[0] === cls,
  )?.[2] ?? '';

test('RS-PAPER-01: after the head comes the paper, with its year, kind, title, author, venue and status', () => {
  const html = page('en/research');
  const card = section(html, 'rs-paper');
  assert.deepEqual(
    {
      after: sections(main(html))[1],
      when: texts(card, 'p', 'rs-paper__when'),
      title: texts(card, 'h2'),
      author: texts(card, 'b'),
      venue: texts(card, 'p', 'rs-paper__venue'),
      note: texts(card, 'p', 'rs-paper__note'),
    },
    {
      after: 'rs-paper',
      when: ['2026 · Workshop paper'],
      title: ['Session Type State Spaces Form Lattices'],
      author: ['Alexandre Zua Caldeira'],
      venue: ['ICE 2026 · International Workshop on Interaction and Concurrency Experience'],
      note: ['Camera-ready · to appear in EPTCS'],
    },
  );
});

const attr = (attrs, name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null;
const PDF = '/assets/pdfs/SessionTypeStateSpacesFormLattices-CameraReady.pdf';

test('RS-PAPER-02: one button opens the paper as a PDF from this site, in the same tab, in every language', () => {
  const READ = { en: 'Read the paper (PDF)', de: 'Paper lesen (PDF)', pt: 'Ler o artigo (PDF)' };
  const links = Object.fromEntries(
    LANGS.map((lang) => [
      lang,
      [...section(page(`${lang}/research`), 'rs-paper').matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].map(([, attrs, inner]) => ({
        label: text(inner),
        href: attr(attrs, 'href'),
        type: attr(attrs, 'type'),
        hreflang: attr(attrs, 'hreflang'),
        target: attr(attrs, 'target'),
      })),
    ]),
  );
  assert.deepEqual(
    links,
    Object.fromEntries(
      LANGS.map((lang) => [
        lang,
        [{ label: READ[lang], href: PDF, type: 'application/pdf', hreflang: 'en', target: null }],
      ]),
    ),
  );
  assert.ok(existsSync(join(browser, PDF)), 'the paper is not in the build');
});

const ABSTRACT =
  'We prove that the state space of every well-formed session type, quotiented by strongly connected components, forms a bounded lattice; n-ary parallel composition yields product lattices. Two consequences follow: duality preserves the lattice up to isomorphism, and Gay–Hole width subtyping corresponds to lattice embedding for non-recursive types. We validate this on 108 benchmark protocols across networking, databases, distributed systems, AI, and fault tolerance: all form lattices, 93 distributive, 15 non-distributive. Mechanised in Lean 4 with two independently developed tool implementations.';

test('RS-PAPER-03, 04 (R2): the abstract word for word under its label, in English on every page, and said so on de and pt', () => {
  const shown = Object.fromEntries(
    LANGS.map((lang) => {
      const card = section(page(`${lang}/research`), 'rs-paper');
      const quote = card.match(/<blockquote\b([^>]*)>(.*?)<\/blockquote>/s);
      return [
        lang,
        {
          label: texts(card, 'h3'),
          inEnglish: texts(card, 'p', 'rs-paper__lang'),
          abstract: text(quote?.[2] ?? ''),
          lang: attr(quote?.[1] ?? '', 'lang'),
          translate: attr(quote?.[1] ?? '', 'translate'),
        },
      ];
    }),
  );
  const quoted = (label, inEnglish, lang) => ({ label: [label], inEnglish, abstract: ABSTRACT, lang, translate: 'no' });
  assert.deepEqual(shown, {
    en: quoted('Abstract', [], null),
    de: quoted('Zusammenfassung', ['Auf Englisch'], 'en'),
    pt: quoted('Resumo', ['Em inglês'], 'en'),
  });
});

test('RS-PAPER-05: title, author and venue stay as published on every page, marked so', () => {
  const published = (lang) => {
    const card = section(page(`${lang}/research`), 'rs-paper');
    const tag = (pattern) => card.match(pattern) ?? [];
    const [, h2Attrs = '', h2 = ''] = tag(/<h2\b([^>]*)>(.*?)<\/h2>/s);
    const [, authorAttrs = '', author = ''] = tag(/<p\b([^>]*class="rs-paper__author"[^>]*)>(.*?)<\/p>/s);
    const [, venueAttrs = '', venue = ''] = tag(/<p\b([^>]*class="rs-paper__venue"[^>]*)>(.*?)<\/p>/s);
    return {
      fields: [text(h2), text(author), text(venue)],
      translate: [h2Attrs, authorAttrs, venueAttrs].map((attrs) => attr(attrs, 'translate')),
      titleLang: attr(h2Attrs, 'lang'),
    };
  };
  const en = published('en');
  assert.deepEqual(
    { de: published('de'), pt: published('pt') },
    { de: { ...en, titleLang: 'en' }, pt: { ...en, titleLang: 'en' } },
  );
  assert.deepEqual(en.translate, ['no', 'no', 'no']);
});

// The four statements of the paper (the spec's table, D3): label and text, as on the English page.
const STATEMENTS = [
  ['Theorem 15 · Reticulate Theorem', 'For every well-formed session type S, ℒ(S)/≡ is a bounded lattice.'],
  [
    'Definition 6 · SCC quotient',
    'The SCC quotient ℒ(S)/≡ identifies mutually reachable states, collapsing each recursion cycle to one class. It is ordered by [s₁] ≤ [s₂] iff s₂ ↠ s₁: a state is smaller when less of the protocol remains, so execution descends from q⊤ to q⊥.',
  ],
  ['Lemma 8 · End', 'ℒ(end)/≡ is a bounded lattice.'],
  [
    'Proposition 18 · Duality isomorphism',
    'For every well-formed session type S, there is a bounded-lattice isomorphism ℒ(S)/≡ ≅ ℒ(dual(S))/≡.',
  ],
];
const statements = (results) =>
  [...results.matchAll(/<blockquote\b[^>]*>(.*?)<\/blockquote>/gs)].map(([, inner]) => [
    texts(inner, 'p', 'rs-results__label')[0],
    texts(inner, 'p', 'rs-results__text')[0],
  ]);

test('RS-RES-01, 02: after the paper, what it proves: the theorem, then the three, all open', () => {
  const html = page('en/research');
  const results = section(html, 'rs-results');
  assert.deepEqual(
    {
      after: sections(main(html))[2],
      heading: texts(results, 'h2'),
      statements: statements(results),
      folded: /<details\b/.test(results),
    },
    { after: 'rs-results', heading: ['What it proves'], statements: STATEMENTS, folded: false },
  );
});

test('RS-RES-03, 04: on de and pt the labels are translated; the statements’ names and texts are not', () => {
  const read = (lang) => {
    const results = section(page(`${lang}/research`), 'rs-results');
    return {
      heading: texts(results, 'h2'),
      labels: statements(results).map(([label]) => label),
      texts: statements(results).map(([, body]) => body),
      marks: [...results.matchAll(/<p\b([^>]*class="rs-results__text"[^>]*)>/g)].map(([, attrs]) => [
        attr(attrs, 'translate'),
        attr(attrs, 'lang'),
      ]),
    };
  };
  const names = STATEMENTS.map(([label]) => label.split(' · ')[1]);
  const marked = Array(4).fill(['no', 'en']);
  const englishTexts = STATEMENTS.map(([, body]) => body);
  assert.deepEqual(
    { de: read('de'), pt: read('pt') },
    {
      de: {
        heading: ['Was es beweist'],
        labels: ['Satz 15', 'Definition 6', 'Lemma 8', 'Proposition 18'].map((kind, i) => `${kind} · ${names[i]}`),
        texts: englishTexts,
        marks: marked,
      },
      pt: {
        heading: ['O que prova'],
        labels: ['Teorema 15', 'Definição 6', 'Lema 8', 'Proposição 18'].map((kind, i) => `${kind} · ${names[i]}`),
        texts: englishTexts,
        marks: marked,
      },
    },
  );
});

test('RS-RES-06 (D20): with four statements stored, the Software band still shows the theorem alone', () => {
  const band = section(page('de/software'), 'band');
  assert.deepEqual(
    {
      labels: texts(band, 'p', 'band__label'),
      others: STATEMENTS.slice(1).map(([, body]) => body).filter((body) => text(band).includes(body)),
    },
    { labels: ['Satz 15 · Reticulate Theorem'], others: [] },
  );
});

// How it was checked: the <dl>'s figures as "value: label", then the paragraphs after it.
const checks = (html) => {
  const inner = section(html, 'rs-checks');
  const dl = inner.match(/<dl\b[^>]*>(.*?)<\/dl>/s)?.[1] ?? '';
  return {
    heading: texts(inner, 'h2'),
    figures: [...dl.matchAll(/<dt\b[^>]*>(.*?)<\/dt>\s*<dd\b[^>]*>(.*?)<\/dd>/gs)].map(
      ([, value, label]) => `${text(value)}: ${text(label)}`,
    ),
    after: texts(inner.split(/<\/dl>/)[1] ?? '', 'p'),
  };
};

test('RS-CHECK-01, RS-WALL-05: four figures say how it was checked, then the evidence, then which count is which', () => {
  assert.deepEqual(checks(page('en/research')), {
    heading: ['How it was checked'],
    figures: [
      '108: benchmark protocols, every one a lattice',
      '93: distributive',
      '15: not distributive',
      'Lean 4: mechanised proof',
    ],
    after: [
      'Checked on 108 benchmark protocols from networking, databases, distributed systems and AI. Mechanised in Lean 4, with two independent tool implementations.',
      'The 93 and 15 are the paper’s own count over its 108 protocols. The wall draws the same corpus at rung R2′, which keeps the structure of recursive protocols: there 47 of the 74 distinct lattices are not distributive, and 50 of the 104 protocols fall in one of them.',
    ],
  });
});

// The tool (D21): its heading, then the shared row's parts.
const tool = (html) => {
  const inner = section(html, 'rs-tool');
  return {
    heading: texts(inner, 'h2'),
    kicker: texts(inner, 'p', 'work-row__kicker'),
    title: [...inner.matchAll(/<h3\b([^>]*)>(.*?)<\/h3>/gs)].map(([, attrs, body]) => ({
      text: text(body),
      translate: attr(attrs, 'translate'),
    })),
    text: texts(inner, 'p', 'work-row__text'),
    stack: texts(inner, 'p', 'work-row__stack'),
  };
};

test('RS-TOOL-01: the tool behind the paper is named and described, as on the Software page', () => {
  assert.deepEqual(tool(page('en/research')), {
    heading: ['The tool'],
    kicker: ['Verification tool'],
    title: [{ text: 'reticulateP', translate: 'no' }],
    text: [
      'Builds the state space of a session type and checks that it forms a lattice. It turned the ICE 2026 paper’s 108 benchmark protocols into lattices, is one of the paper’s two independent tool implementations, and checks every session type on this site.',
    ],
    stack: ['Python'],
  });
});

// The closing row: its heading and its links, each with what a reader and a screen reader get.
const RESEARCHGATE = 'https://www.researchgate.net/profile/Alexandre-Caldeira';
const more = (html) => {
  const inner = section(html, 'rs-more');
  return {
    heading: texts(inner, 'h2'),
    links: [...inner.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].map(([, attrs, body]) => ({
      label: text(body.replace(/<span\b[^>]*>.*?<\/span>/gs, '')),
      href: attr(attrs, 'href'),
      target: attr(attrs, 'target'),
    })),
  };
};

test('RS-MORE-01: the page ends with earlier papers and the research profile', () => {
  const html = page('en/research');
  assert.deepEqual(
    { last: sections(main(html)).at(-1), ...more(html) },
    {
      last: 'rs-more',
      heading: ['More research'],
      links: [
        { label: 'Earlier papers (2007–2010)', href: '/en/writing', target: null },
        { label: 'ResearchGate', href: RESEARCHGATE, target: '_blank' },
      ],
    },
  );
});

test('RS-CHECK-02, 03: on de and pt the meanings and the evidence are translated, the numbers are not', () => {
  const read = (lang) => {
    const { heading, figures, after } = checks(page(`${lang}/research`));
    return { heading, values: figures.map((f) => f.split(': ')[0]), labels: figures.map((f) => f.split(': ')[1]), evidence: after[0] };
  };
  const VALUES = ['108', '93', '15', 'Lean 4'];
  assert.deepEqual(
    { de: read('de'), pt: read('pt') },
    {
      de: {
        heading: ['Wie es geprüft wurde'],
        values: VALUES,
        labels: ['Benchmark-Protokolle, jedes ein Verband', 'distributiv', 'nicht distributiv', 'mechanisierter Beweis'],
        evidence:
          'Geprüft an 108 Benchmark-Protokollen aus Netzwerken, Datenbanken, verteilten Systemen und KI. In Lean 4 mechanisiert, mit zwei unabhängigen Werkzeug-Implementierungen.',
      },
      pt: {
        heading: ['Como foi verificado'],
        values: VALUES,
        labels: ['protocolos de referência, todos reticulados', 'distributivos', 'não distributivos', 'prova mecanizada'],
        evidence:
          'Verificado em 108 protocolos de referência de redes, bases de dados, sistemas distribuídos e IA. Mecanizado em Lean 4, com duas implementações independentes.',
      },
    },
  );
});

test('RS-WALL-05: on de and pt the rung note follows the evidence, in the page language', () => {
  assert.deepEqual(
    { de: checks(page('de/research')).after[1], pt: checks(page('pt/research')).after[1] },
    {
      de: 'Die 93 und 15 sind die eigene Zählung des Papers über seine 108 Protokolle. Die Wand zeichnet denselben Korpus auf Stufe R2′, die die Struktur rekursiver Protokolle erhält: Dort sind 47 der 74 verschiedenen Verbände nicht distributiv, und 50 der 104 Protokolle fallen in einen davon.',
      pt: 'Os 93 e 15 são a contagem do próprio artigo sobre os seus 108 protocolos. A parede desenha o mesmo corpus no nível R2′, que mantém a estrutura dos protocolos recursivos: aí 47 dos 74 reticulados distintos não são distributivos, e 50 dos 104 protocolos caem num deles.',
    },
  );
});

test('RS-TOOL-02: the tool has one link, to the Software page in the same language and tab, no repository', () => {
  const links = [...section(page('de/research'), 'rs-tool').matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].map(
    ([, attrs, body]) => ({ label: text(body), href: attr(attrs, 'href'), target: attr(attrs, 'target') }),
  );
  assert.deepEqual(links, [{ label: 'reticulateP auf der Software-Seite', href: '/de/software', target: null }]);
});

test('RS-SHOT-01 (D10): until the screenshot exists, the tool shows no frame, image or placeholder', () => {
  const found = LANGS.flatMap((lang) => {
    const inner = section(page(`${lang}/research`), 'rs-tool');
    return [
      ...[/<figure\b/, /<img\b/].filter((tag) => tag.test(inner)).map(String),
      ...['BICA', 'Screenshot', 'placeholder'].filter((word) => text(inner).includes(word)),
    ].map((what) => `${lang}: ${what}`);
  });
  assert.deepEqual(found, []);
});

test('RS-MORE-02: the profile opens in a new tab, and says so in the page language', () => {
  const link = section(page('de/research'), 'rs-more').match(/<a\b([^>]*target="_blank"[^>]*)>(.*?)<\/a>/s);
  const [, attrs = '', body = ''] = link ?? [];
  assert.deepEqual(
    {
      href: attr(attrs, 'href'),
      rel: attr(attrs, 'rel'),
      arrow: /<span\b[^>]*aria-hidden="true"[^>]*>↗<\/span>/.test(body),
      hidden: texts(body, 'span', 'visually-hidden'),
    },
    { href: RESEARCHGATE, rel: 'noopener noreferrer', arrow: true, hidden: ['(öffnet in einem neuen Tab)'] },
  );
});

test('RS-MORE-03: on de and pt the words around the links are translated, ResearchGate stays', () => {
  const closing = (heading, earlier, lang) => ({
    heading: [heading],
    links: [
      { label: earlier, href: `/${lang}/writing`, target: null },
      { label: 'ResearchGate', href: RESEARCHGATE, target: '_blank' },
    ],
  });
  assert.deepEqual(
    { de: more(page('de/research')), pt: more(page('pt/research')) },
    {
      de: closing('Mehr Forschung', 'Frühere Paper (2007–2010)', 'de'),
      pt: closing('Mais investigação', 'Artigos anteriores (2007–2010)', 'pt'),
    },
  );
});

test('RS-MORE-04 (Q3): no other profile, ResearchGate alone, in any language', () => {
  const OTHERS = ['ORCID', 'orcid.org', 'DBLP', 'dblp.org', 'Google Scholar', 'scholar.google'];
  const found = LANGS.flatMap((lang) => {
    const html = main(page(`${lang}/research`));
    return OTHERS.filter((name) => html.includes(name)).map((name) => `${lang}: ${name}`);
  });
  assert.deepEqual(found, []);
});

test('RS-PAGE-04 (D34 in software.md): the menu shows Forschung as the page you are on, and only it', () => {
  const links = menu(page('de/research'));
  assert.deepEqual(
    links.filter((link) => link.includes('/de/research') || link.endsWith('(current)')),
    ['Forschung → /de/research (current)'],
  );
});
