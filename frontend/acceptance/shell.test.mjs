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
    ['home', 'about', 'research', 'running', 'contact'].map((name) => [`${lang}/${name}`, lang]),
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
          '/de/software#x',
        ]),
        'de/research',
        'de',
      ),
    },
    {
      root: [],
      notFound: [],
      research: ['de/research → /', 'de/research → /en/research', 'de/research → /de/software'],
    },
  );
});

test('SHELL-04: every link inside the site on every built page keeps its language and is a page of the build', () => {
  const wrong = PAGES.flatMap(([route, pageLang]) => wrongLinks(page(route), route, pageLang));
  assert.deepEqual([...new Set(wrong)], []);
});

// The language links: every `<a>` with `hreflang`, as "hreflang href", with " current" when it
// carries `aria-current`. The header's codes and the footer's names give the same lines.
const languageLinks = (html) =>
  [
    ...new Set(
      [...html.matchAll(/<a\b[^>]*>/g)]
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
