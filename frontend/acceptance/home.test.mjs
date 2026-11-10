// Acceptance tests for the home page, read from the prerendered build.
// Run `npm run build` first, then `npm run acceptance`. Examples: docs/examples/home.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');
const page = (route) => readFileSync(join(browser, route, 'index.html'), 'utf8');

// A failure names the missing fragment, not the whole page (fonts are inlined, ~270 kB).
function contains(html, fragment, route) {
  assert.ok(html.includes(fragment), `${route} lacks ${fragment}`);
}

test('HOME-PAGE-01: each language has its own home page with its lang attribute', () => {
  for (const lang of ['en', 'de', 'pt']) {
    contains(page(`${lang}/home`), `<html lang="${lang}"`, `${lang}/home`);
  }
});

test('HOME-PAGE-02: the German home links to every language version', () => {
  const html = page('de/home');
  for (const [hreflang, path] of [
    ['en', 'en/home'],
    ['de', 'de/home'],
    ['pt', 'pt/home'],
    ['x-default', 'en/home'],
  ]) {
    contains(
      html,
      `<link rel="alternate" hreflang="${hreflang}" href="https://zuacaldeira.com/${path}">`,
      'de/home',
    );
  }
});

test('HOME-PAGE-03: the home page title is the name and the tagline in its language', () => {
  for (const [lang, title] of [
    ['pt', 'Alexandre Caldeira — Investigador. Programador. Educador. Corredor.'],
    ['en', 'Alexandre Caldeira — Researcher. Developer. Educator. Runner.'],
    ['de', 'Alexandre Caldeira — Forscher. Entwickler. Erzieher. Läufer.'],
  ]) {
    contains(page(`${lang}/home`), `<title>${title}</title>`, `${lang}/home`);
  }
});

test('HOME-PAGE-04: the site root is the English home, linked to the German and Portuguese', () => {
  const html = page('.');
  contains(html, '<html lang="en"', 'index.html');
  contains(html, '<title>Alexandre Caldeira — Researcher. Developer. Educator. Runner.</title>', 'index.html');
  contains(html, 'I build software, and prove its protocols hold.</h1>', 'index.html');
  for (const lang of ['de', 'pt']) {
    contains(
      html,
      `<link rel="alternate" hreflang="${lang}" href="https://zuacaldeira.com/${lang}/home">`,
      'index.html',
    );
  }
});

// One English page for every unknown path (D9); nginx serves its copy, 404.html, with status 404.
test('HOME-PAGE-06: the build has the English 404 page with the way back home', () => {
  assert.ok(existsSync(join(browser, '404', 'index.html')), 'the build has no 404/index.html');
  const html = page('404');
  contains(html, '<html lang="en"', '404');
  assert.equal(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g, '').trim(), '⊥ Page not found');
  contains(html, 'This path ends at the bottom: there is no page here.', '404');
  assert.match(html, /<a [^>]*href="\/en\/home"[^>]*>\s*Back to the home page\s*<\/a>/, '404 lacks the link home');
});

test('HOME-PAGE-06: the 404 page is titled with the name and "Page not found" (D29)', () => {
  assert.equal(page('404').match(/<title>(.*?)<\/title>/)?.[1], 'Alexandre Caldeira — Page not found');
});

// The sitemap is hand-written in public/ (D43); the build copies it, so the built one is read.
const SITE = 'https://zuacaldeira.com';
const sitemapUrls = () =>
  [...readFileSync(join(browser, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, url]) => url);

test('HOME-PAGE-07: the sitemap lists none of the old paths, which answer 301 (D33)', () => {
  const old = ['/home', '/about', '/research', '/running', '/contact'].map((path) => SITE + path);
  assert.deepEqual(sitemapUrls().filter((url) => old.includes(url.replace(/\/$/, ''))), []);
});

// Without the trailing slash, as the hreflang links (D41); `/` is the same page as /en/home (D40).
// SW-PAGE-04: the Software page joined it on 2026-11-08, 18 pages; WR-PAGE-04: the Writing page the
// same day, 21 in all.
test('HOME-PAGE-07, SW-PAGE-04, WR-PAGE-04: the sitemap lists every page in en, de and pt, and nothing else (D40, D41)', () => {
  const expected = ['en', 'de', 'pt'].flatMap((lang) =>
    ['home', 'about', 'software', 'research', 'writing', 'running', 'contact'].map(
      (page) => `${SITE}/${lang}/${page}`,
    ),
  );
  assert.deepEqual(sitemapUrls().toSorted(), expected.toSorted());
});

// The sitemap is written by hand (D43); this ties it to what the build prerendered.
test('HOME-PAGE-08: every URL in the sitemap is a page of the build', () => {
  const missing = sitemapUrls().filter(
    (url) => !url.startsWith(`${SITE}/`) || !existsSync(join(browser, url.slice(SITE.length), 'index.html')),
  );
  assert.deepEqual(missing, []);
});

// The build's own backend seeded these (compose.build.yml, db/seed); the page got them from the
// API through the snapshot (D25). The rest of HOME-HERO-01 to 03 comes with the v2 hero (D27).
const SEEDED_SENTENCES = [
  ['de', 'HOME-HERO-01', 'Ich baue Software und beweise, dass ihre Protokolle eingehalten werden.'],
  ['pt', 'HOME-HERO-02', 'Construo software e provo que os seus protocolos se cumprem.'],
  ['en', 'HOME-HERO-03', 'I build software, and prove its protocols hold.'],
];

for (const [lang, id, sentence] of SEEDED_SENTENCES) {
  test(`${id} (sentence): /${lang}/home has the seeded sentence as its h1`, () => {
    const h1 = page(`${lang}/home`).match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1].trim();
    assert.equal(h1, sentence);
  });
}

// The band's paper title in its own element, marked English as the Research page's paper card
// has it: lang only where the page is not English, translate="no" everywhere (HOME-PAPER-10).
const PAPER_TITLE = 'Session Type State Spaces Form Lattices';
const bandTitleMarks = (route) => {
  const eyebrow = page(route).match(/<p\b[^>]*\bclass="paper__eyebrow"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(eyebrow?.includes(PAPER_TITLE), `${route}: no band line with the paper title`);
  const attrs = eyebrow.match(new RegExp(`<(\\w+)([^>]*)>\\s*${PAPER_TITLE}\\s*</\\1>`))?.[2];
  if (attrs === undefined) return 'the title is not in an element of its own';
  return {
    lang: attrs.match(/\slang="([^"]*)"/)?.[1] ?? null,
    translate: attrs.match(/\stranslate="([^"]*)"/)?.[1] ?? null,
  };
};

for (const [lang, marks] of [
  ['de', { lang: 'en', translate: 'no' }],
  ['pt', { lang: 'en', translate: 'no' }],
  ['en', { lang: null, translate: 'no' }],
]) {
  test(`HOME-PAPER-10: on /${lang}/home the band's paper title is marked English`, () => {
    assert.deepEqual(bandTitleMarks(`${lang}/home`), marks);
  });
}

// Both deploys take the site from build-site.yml (D26). Each cp line there must have a source
// the build made. A cp line ending in `|| true` does not match the pattern and is not checked,
// so write none; HOME-PAGE-06's copy must be there, as a plain line.
const buildSite = () =>
  readFileSync(join(import.meta.dirname, '../../.github/workflows/build-site.yml'), 'utf8');

test('HOME-PAGE-06: the site build copies the 404 page to 404.html, which nginx serves (D31)', () => {
  assert.match(
    buildSite(),
    /^\s*cp dist\/zuacaldeira-com\/browser\/404\/index\.html dist\/zuacaldeira-com\/browser\/404\.html\s*$/m,
    'build-site.yml lacks the plain copy of 404/index.html to 404.html',
  );
});

// The live nginx is installed by hand (CLAUDE.md, "Deployment"), so its config is only read here;
// the web image's config, with the same lines, runs for real in acceptance/nginx (D30).
const liveConfig = () =>
  readFileSync(join(import.meta.dirname, '../../infra/live/nginx-site.conf'), 'utf8');

const assertLiveConfigHas = (...lines) => {
  const live = liveConfig().split('\n').map((l) => l.trim());
  for (const line of lines) {
    assert.ok(live.includes(line), `the live config lacks: ${line}`);
  }
};

test('HOME-PAGE-06: the live nginx config answers unknown paths with 404 and 404.html', () => {
  assertLiveConfigHas('try_files $uri $uri/index.html $uri/ =404;', 'error_page 404 /404.html;');
  assert.ok(!liveConfig().includes('index.csr.html'), 'the live config still falls back to index.csr.html');
});

test('HOME-PAGE-10: the live nginx config drops a trailing slash with a 301 (D48)', () => {
  assertLiveConfigHas('rewrite ^(/.+)/$ $1 permanent;');
});

test('HOME-PAGE-05: the live nginx config sends the old paths to their English pages (D36, D48)', () => {
  assertLiveConfigHas(
    'location ~ ^/(home|about|research|running|contact)/?$ {',
    'return 301 /en/$1$is_args$args;',
  );
});

test('HOME-PAGE-04: the site build copies only files the build has', () => {
  const sources = [...buildSite().matchAll(/^\s*cp (dist\/\S+) \S+\s*$/gm)].map(([, from]) => from);
  for (const from of sources) {
    assert.ok(existsSync(join(import.meta.dirname, '..', from)), `build-site.yml copies ${from}, which the build lacks`);
  }
});
