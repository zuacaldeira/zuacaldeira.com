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

// The build's own backend seeded these (compose.build.yml, db/seed); the page got them from the
// API through the snapshot (D25). The rest of HOME-HERO-01 to 03 comes with the v2 hero (D27).
const SEEDED_SENTENCES = [
  ['de', 'HOME-HERO-01', 'Ich baue Software und beweise, dass ihre Protokolle halten.'],
  ['pt', 'HOME-HERO-02', 'Construo software e provo que os seus protocolos se cumprem.'],
  ['en', 'HOME-HERO-03', 'I build software, and prove its protocols hold.'],
];

for (const [lang, id, sentence] of SEEDED_SENTENCES) {
  test(`${id} (sentence): /${lang}/home has the seeded sentence as its h1`, () => {
    const h1 = page(`${lang}/home`).match(/<h1[^>]*>([^<]*)<\/h1>/)?.[1].trim();
    assert.equal(h1, sentence);
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
  assertLiveConfigHas('try_files $uri $uri/ =404;', 'error_page 404 /404.html;');
  assert.ok(!liveConfig().includes('index.csr.html'), 'the live config still falls back to index.csr.html');
});

test('HOME-PAGE-05: the live nginx config sends the old paths to their English pages (D36)', () => {
  assertLiveConfigHas(
    'location ~ ^/(home|about|research|running|contact)/?$ {',
    'return 301 /en$request_uri;',
  );
});

test('HOME-PAGE-04: the site build copies only files the build has', () => {
  const sources = [...buildSite().matchAll(/^\s*cp (dist\/\S+) \S+\s*$/gm)].map(([, from]) => from);
  for (const from of sources) {
    assert.ok(existsSync(join(import.meta.dirname, '..', from)), `build-site.yml copies ${from}, which the build lacks`);
  }
});
