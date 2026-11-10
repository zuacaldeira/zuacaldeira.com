// Acceptance tests for the shell every page shares, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/shell.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// Every built page with its language; `/` and the 404 page are English (D1 in home.md, SHELL-09).
const PAGES = [
  ...['en', 'de', 'pt'].flatMap((lang) =>
    ['home', 'about', 'software', 'research', 'writing', 'running', 'contact'].map((name) => [
      `${lang}/${name}`,
      lang,
    ]),
  ),
  ['.', 'en'],
  ['404', 'en'],
];

// Links inside the site: an `<a href>` that starts with `/`. Links to files (with an extension,
// such as the paper's PDF) are not pages. Each comes with the language it must keep: the page's,
// or for a language link (SHELL-02) the one its `hreflang` names (SHELL-02-P-02).
const siteLinks = (html, pageLang) =>
  [...html.matchAll(/<a\b[^>]*>/g)]
    .map(([tag]) => ({
      href: tag.match(/\shref="(\/[^"#?]*)[^"]*"/)?.[1],
      fragment: /\shref="\/[^"#]*#/.test(tag),
      lang: tag.match(/\shreflang="([^"]*)"/)?.[1] ?? pageLang,
    }))
    .filter(({ href }) => href && !/\.[a-z0-9]+$/i.test(href));

// The links of a page that SHELL-04 refuses, as "route → href". A link to a spot on the page itself
// (its own path and a `#`, the skip link) is no navigation and is left out (D19).
const wrongLinks = (html, route, pageLang) =>
  siteLinks(html, pageLang)
    .filter(({ href, fragment }) => !(fragment && href === (route === '.' ? '/' : `/${route}`)))
    .filter(
      ({ href, lang }) =>
        !new RegExp(`^/${lang}/[a-z-]+$`).test(href) ||
        !existsSync(join(browser, href, 'index.html')),
    )
    .map(({ href }) => `${route} → ${href}`);

test('SHELL-04 (D19): a link to a spot on the same page passes; a # link to another page is still refused', () => {
  const links = (hrefs) => hrefs.map((href) => `<a href="${href}">x</a>`).join('');
  assert.deepEqual(
    {
      root: wrongLinks(links(['/#main-content']), '.', 'en'),
      notFound: wrongLinks(links(['/404#main-content']), '404', 'en'),
      research: wrongLinks(
        links([
          '/de/research#main-content',
          '/#main-content',
          '/en/research#main-content',
          '/de/nope#x',
        ]),
        'de/research',
        'de',
      ),
    },
    {
      root: [],
      notFound: [],
      research: ['de/research → /', 'de/research → /en/research', 'de/research → /de/nope'],
    },
  );
});

test('SHELL-04: every link inside the site on every built page keeps its language and is a page of the build', () => {
  const wrong = PAGES.flatMap(([route, pageLang]) => wrongLinks(page(route), route, pageLang));
  assert.deepEqual([...new Set(wrong)], []);
});

// The language links: every `<a>` with `hreflang` in a `LanguageLinks`, as "hreflang href", with
// " current" when it carries `aria-current`. The header's codes and the footer's names give the same
// lines. Other links may carry `hreflang` too: the Writing page's papers say they are English.
const languageLinks = (html) =>
  [
    ...new Set(
      [...html.matchAll(/<app-language-links\b[^>]*>(.*?)<\/app-language-links>/gs)]
        .flatMap(([, inner]) => [...inner.matchAll(/<a\b[^>]*>/g)])
        .map(([tag]) => tag)
        .filter((tag) => /\shreflang="/.test(tag))
        .map((tag) => {
          const attr = (name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
          return `${attr('hreflang')} ${attr('href')}${attr('aria-current') ? ' current' : ''}`;
        }),
    ),
  ].sort();

// The links inside an element's HTML, each as [text, and the named attributes].
const anchors = (html, names) =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, text]) => [
    text.replace(/<[^>]*>/g, '').trim(),
    ...names.map((name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? null),
  ]);

test('SHELL-01: the header of /de/home has EN, DE and PT in a navigation labelled "Sprache", DE current', () => {
  const nav = page('de/home').match(/<nav\b[^>]*\saria-label="Sprache"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(nav, 'a nav labelled "Sprache"');
  assert.deepEqual(anchors(nav[1], ['href', 'hreflang', 'lang', 'aria-label', 'aria-current']), [
    ['EN', '/en/home', 'en', 'en', 'English (EN)', null],
    ['DE', '/de/home', 'de', 'de', 'Deutsch (DE)', 'page'],
    ['PT', '/pt/home', 'pt', 'pt', 'Português (PT)', null],
  ]);
});

test('SHELL-03: the footer of /pt/home lists English, Deutsch and Português, Português current', () => {
  const footer = page('pt/home').match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/);
  assert.ok(footer, 'a footer');
  const languages = anchors(footer[1], ['hreflang', 'aria-current']).filter(
    ([, hreflang]) => hreflang,
  );
  assert.deepEqual(languages, [
    ['English', 'en', null],
    ['Deutsch', 'de', null],
    ['Português', 'pt', 'page'],
  ]);
});

const htmlLang = (html) => html.match(/<html\b[^>]*\slang="([^"]*)"/)?.[1];

// The contact buttons in a page's header, each as "text → href", the text with its tags taken out.
const contactButtons = (html) =>
  [
    ...(html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? '').matchAll(
      /<a\b([^>]*\sclass="[^"]*\bnav-cta\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/g,
    ),
  ].map(
    ([, attrs, text]) =>
      `${text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()} → ${attrs.match(/\shref="([^"]*)"/)?.[1]}`,
  );

const CONTACT = { en: '⊥ write to me', de: '⊥ Kontakt', pt: '⊥ Contacto' };

test("SHELL-05: on every built page the header has one contact button, in the page's language, to its contact page", () => {
  const buttons = Object.fromEntries(PAGES.map(([route]) => [route, contactButtons(page(route))]));
  const expected = Object.fromEntries(
    PAGES.map(([route, lang]) => [route, [`${CONTACT[lang]} → /${lang}/contact`]]),
  );
  assert.deepEqual(buttons, expected);
  for (const lang of ['en', 'de', 'pt']) {
    assert.equal(htmlLang(page(`${lang}/contact`)), lang, `${lang}/contact has lang="${lang}"`);
  }
});

test('SHELL-02: on every built page EN, DE and PT lead to the same page in their language, the current one marked', () => {
  for (const [route, lang] of PAGES) {
    const notFound = route === '404';
    const name = route === '.' || notFound ? 'home' : route.split('/')[1];
    const expected = ['de', 'en', 'pt'].map(
      (l) => `${l} /${l}/${name}${l === lang && !notFound ? ' current' : ''}`,
    );
    assert.deepEqual(languageLinks(page(route)), expected, route);
  }
  for (const lang of ['en', 'de', 'pt']) {
    assert.equal(htmlLang(page(`${lang}/research`)), lang, `${lang}/research has lang="${lang}"`);
  }
});

const text = (html) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// A page's footers, each as its paragraphs and headings in order, and its links as "text → href";
// a language link (it has `hreflang`) by its text alone, its href is SHELL-02's.
const footers = (html) =>
  [...html.matchAll(/<footer\b[^>]*>([\s\S]*?)<\/footer>/g)].map(([, footer]) => ({
    texts: [...footer.matchAll(/<(p|h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)].map(
      ([, tag, inner]) => `${tag}: ${text(inner)}`,
    ),
    links: [...footer.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, inner]) =>
      /\shreflang="/.test(attrs)
        ? text(inner)
        : `${text(inner)} → ${attrs.match(/\shref="([^"]*)"/)?.[1]}`,
    ),
  }));

const FOOTER = {
  en: [
    'p: ⊥ end · every protocol ends here',
    'h2: Let’s talk about your system.',
    'p: Open to software engineering and research roles, and to collaborations on protocols, verification and agent systems.',
  ],
  de: [
    'p: ⊥ end · hier endet jedes Protokoll',
    'h2: Sprechen wir über dein System.',
    'p: Offen für Stellen in Softwareentwicklung und Forschung und für Zusammenarbeit zu Protokollen, Verifikation und Agentensystemen.',
  ],
  pt: [
    'p: ⊥ end · todo o protocolo acaba aqui',
    'h2: Vamos falar do teu sistema.',
    'p: Aberto a funções em engenharia de software e investigação, e a colaborações em protocolos, verificação e sistemas de agentes.',
  ],
};
const CV = { en: 'CV (PDF)', de: 'Lebenslauf (PDF)', pt: 'CV (PDF)' };

// The checked form of the `Zua = …` line (D33), as reticulateP reads it, and the short form the
// site shows: a one-branch thread `&{x: end}` is written as its label, `||` as `∥`.
const CHECKED = readFileSync(
  join(import.meta.dirname, '../../docs/notation/zua.st'),
  'utf8',
).trim();
const short = (checked) =>
  checked.replace(/&\{\s*([a-z]+)\s*:\s*end\s*\}/g, '$1').replace(/\s*\|\|\s*/g, ' ∥ ');
const CITY = { en: 'Berlin', de: 'Berlin', pt: 'Berlim' };

// The texts of each footer's bottom row: its spans and links, in order (tags inside them dropped).
const bottomRows = (html) =>
  [...html.matchAll(/<footer\b[^>]*>([\s\S]*?)<\/footer>/g)].flatMap(([, footer]) =>
    [...footer.matchAll(/<div\b[^>]*\bclass="foot__bottom"[^>]*>([\s\S]*?)<\/div>/g)].map(
      ([, row]) =>
        [...row.matchAll(/<(span|a)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(([, , inner]) => text(inner)),
    ),
  );

test("SHELL-07b: on every built page the footer's bottom row reads the checked Zua line, the languages and the copyright", () => {
  assert.equal(short(CHECKED), 'Zua = software ∥ research ∥ running');
  const year = (rows) => rows[0]?.at(-1)?.match(/^© (\d{4}) /)?.[1];
  const actual = Object.fromEntries(PAGES.map(([route]) => [route, bottomRows(page(route))]));
  const expected = Object.fromEntries(
    PAGES.map(([route, lang]) => {
      const y = year(actual[route]);
      return [
        route,
        [
          [
            short(CHECKED),
            'English',
            'Deutsch',
            'Português',
            `© ${y && Number(y) >= 2026 ? y : 'YYYY ≥ 2026'} Alexandre Zua Caldeira · ${CITY[lang]}`,
          ],
        ],
      ];
    }),
  );
  assert.deepEqual(actual, expected);
});

// The notation fonts (D38 to D42). Main: what Fraunces, Archivo and IBM Plex Mono all hold (D39).
// N: the symbols `src/index.html` asks Google Fonts for (D41); the build inlines their faces (D42).
const MAIN_MARKS = new Set('–—‘’‚“”„†•…′″‹›€™');
const inMain = (c) => {
  const cp = c.codePointAt(0);
  return (
    c === '\t' ||
    c === '\n' ||
    c === '\r' ||
    (cp >= 0x20 && cp < 0x7f) ||
    (cp >= 0xa0 && cp <= 0x17f && c !== 'ŉ' && c !== 'ſ') ||
    MAIN_MARKS.has(c)
  );
};
const INDEX_HTML = readFileSync(join(import.meta.dirname, '../src/index.html'), 'utf8');
const notationLinks = (html) =>
  [...html.matchAll(/<link\b[^>]*\bhref="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]*)"/g)]
    .map(([, href]) => new URL(href.replaceAll('&amp;', '&')))
    .filter((url) => url.searchParams.getAll('family').includes('Noto Sans Math'));
const faces = (html, family) =>
  [...html.matchAll(/@font-face\{[^}]*\}/g)].filter(([face]) =>
    face.includes(`font-family:'${family}'`),
  ).length;
// The text a page shows: its body without scripts, styles, comments, tags and attributes.
const bodyText = (html) =>
  (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/)?.[1] ?? '')
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/<style\b[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(
      /&(amp|lt|gt|quot|apos);/g,
      (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[e],
    );

test('SHELL-13b: every symbol a built page shows is one its fonts hold, and the notation fonts load only those', () => {
  const links = notationLinks(INDEX_HTML);
  const n = new Set(links[0]?.searchParams.get('text') ?? '');
  const shown = Object.fromEntries(
    PAGES.map(([route]) => [route, [...new Set(bodyText(page(route)))].filter((c) => !inMain(c))]),
  );
  assert.deepEqual(
    {
      links: links.map((url) => [
        url.searchParams.getAll('family'),
        url.searchParams.get('display'),
      ]),
      unloaded: Object.entries(shown).flatMap(([route, cs]) =>
        cs.filter((c) => !n.has(c)).map((c) => `${route}: ${c}`),
      ),
      neverShown: [...n].filter((c) => !Object.values(shown).some((cs) => cs.includes(c))),
      withoutFaces: PAGES.map(([route]) => route).filter(
        (route) =>
          faces(page(route), 'Noto Sans Math') !== 1 || faces(page(route), 'STIX Two Text') !== 1,
      ),
    },
    {
      links: [[['Noto Sans Math', 'STIX Two Text'], 'swap']],
      unloaded: [],
      neverShown: [],
      withoutFaces: [],
    },
  );
});

test("SHELL-07: on every built page the footer invites a talk, in the page's language, with mail, profiles and CV", () => {
  const actual = Object.fromEntries(PAGES.map(([route]) => [route, footers(page(route))]));
  const expected = Object.fromEntries(
    PAGES.map(([route, lang]) => [
      route,
      [
        {
          texts: FOOTER[lang],
          links: [
            'hello@zuacaldeira.com → mailto:hello@zuacaldeira.com',
            'GitHub → https://github.com/zuacaldeira',
            'LinkedIn → https://linkedin.com/in/zuacaldeira',
            `${CV[lang]} → /assets/cv/alexandre-zua-caldeira-cv.pdf`,
            'English',
            'Deutsch',
            'Português',
          ],
        },
      ],
    ]),
  );
  assert.deepEqual(actual, expected);
});
