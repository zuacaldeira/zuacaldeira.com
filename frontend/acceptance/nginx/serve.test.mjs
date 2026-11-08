// The web image's nginx (frontend/docker/nginx.conf) serving the built site, for real (D30).
// Needs Docker and a prepared build: `npm run build`, then the copy of 404/index.html to 404.html
// that build-site.yml makes. Run with `npm run acceptance:nginx`. Examples: docs/examples/home.md.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const frontend = join(import.meta.dirname, '../..');
const site = join(frontend, 'dist/zuacaldeira-com/browser');
const config = join(frontend, 'docker/nginx.conf');
const IMAGE = 'nginxinc/nginx-unprivileged:1.27-alpine';

const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8' }).trim();

let container;
let origin;

before(async () => {
  assert.ok(existsSync(join(site, '404.html')), 'the build has no 404.html: copy it as build-site.yml does');
  container = docker(
    'run', '-d', '--rm', '-p', '127.0.0.1::8080',
    '-v', `${site}:/usr/share/nginx/html:ro`,
    '-v', `${config}:/etc/nginx/conf.d/default.conf:ro`,
    IMAGE,
  );
  origin = `http://${docker('port', container, '8080/tcp').split('\n')[0]}`;
  for (let tries = 0; ; tries++) {
    try {
      await fetch(origin);
      return;
    } catch (error) {
      if (tries > 50) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
});

after(() => {
  if (container) docker('rm', '-f', container);
});

test('HOME-PAGE-06: /fr/home answers 404 with the English 404 page', async () => {
  const response = await fetch(`${origin}/fr/home`);
  const html = await response.text();
  assert.equal(response.status, 404);
  assert.ok(html.includes('<html lang="en"'), 'the answer lacks lang="en"');
  assert.ok(html.includes('Page not found</h1>'), 'the answer is not the 404 page');
});

async function assertServedDirectly(path) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
  const html = await response.text();
  assert.equal(response.status, 200, `${path} answers ${response.status} ${response.headers.get('location') ?? ''}`);
  assert.ok(!html.includes('Page not found</h1>'), `${path} shows the 404 page`);
  return html;
}

test('HOME-PAGE-06: the prerendered pages, the site root included, still answer 200', async () => {
  for (const path of ['/', '/en/home', '/de/home']) await assertServedDirectly(path);
});

test('HOME-PAGE-09: /en/home answers 200 with no redirect', async () => {
  const html = await assertServedDirectly('/en/home');
  assert.ok(html.includes('<html lang="en"'), '/en/home is not the English page');
});

const sitemapPaths = () => {
  const sitemap = readFileSync(join(site, 'sitemap.xml'), 'utf8');
  return [...sitemap.matchAll(/<loc>https:\/\/zuacaldeira\.com(\/[^<]*)<\/loc>/g)].map(([, p]) => p);
};

test('HOME-PAGE-09: every URL in the sitemap answers 200 with no redirect', async () => {
  const paths = sitemapPaths();
  assert.equal(paths.length, 18, 'the sitemap does not list the 18 pages (SW-PAGE-04)');
  for (const path of paths) await assertServedDirectly(path);
});

test('HOME-PAGE-09: every hreflang link of the built pages answers 200 with no redirect', async () => {
  const targets = new Set();
  for (const page of sitemapPaths()) {
    const html = readFileSync(join(site, page, 'index.html'), 'utf8');
    for (const [, path] of html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="https:\/\/zuacaldeira\.com(\/[^"]*)">/g)) {
      targets.add(path);
    }
  }
  assert.ok(targets.size > 0, 'the built pages have no hreflang links');
  for (const path of targets) await assertServedDirectly(path);
});

async function assertMovedTo(path, location) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
  assert.equal(response.status, 301, `${path} answers ${response.status}`);
  assert.equal(response.headers.get('location'), location);
}

test('HOME-PAGE-10: a page with a trailing slash answers 301 to its URL without it', async () => {
  await assertMovedTo('/en/home/', '/en/home');
  await assertMovedTo('/de/about/?x=1', '/de/about?x=1');
});

test('SW-PAGE-06: the Software page opens straight away in every language; with a slash, one 301', async () => {
  for (const lang of ['en', 'de', 'pt']) {
    const html = await assertServedDirectly(`/${lang}/software`);
    assert.ok(html.includes(`<html lang="${lang}"`), `/${lang}/software is not the ${lang} page`);
  }
  await assertMovedTo('/de/software/', '/de/software');
});

test('HOME-PAGE-05: the old /home answers 301 to /en/home', async () => {
  await assertMovedTo('/home', '/en/home');
});

test('HOME-PAGE-05: every other old path answers 301 to its English page', async () => {
  for (const page of ['about', 'research', 'running', 'contact']) {
    await assertMovedTo(`/${page}`, `/en/${page}`);
  }
});

test('HOME-PAGE-05: an old path drops a trailing slash and keeps its query string', async () => {
  await assertMovedTo('/home/', '/en/home');
  await assertMovedTo('/home/?from=cv', '/en/home?from=cv');
  await assertMovedTo('/about?from=cv', '/en/about?from=cv');
});

test('HOME-PAGE-05: an old link opens the English page in one hop', async () => {
  for (const path of ['/home', '/home/', '/about', '/research', '/running', '/contact']) {
    const hop = await fetch(`${origin}${path}`, { redirect: 'manual' });
    assert.equal(hop.status, 301, `${path} answers ${hop.status}`);
    const html = await assertServedDirectly(hop.headers.get('location'));
    assert.ok(html.includes('<html lang="en"'), `${path} does not end on an English page`);
  }
});

test('HOME-PAGE-05: only the old paths themselves are redirected', async () => {
  for (const path of ['/homepage', '/home/x']) {
    const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 404, `${path} answers ${response.status}`);
  }
});
