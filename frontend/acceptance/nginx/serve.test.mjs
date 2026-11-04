// The web image's nginx (frontend/docker/nginx.conf) serving the built site, for real (D30).
// Needs Docker and a prepared build: `npm run build`, then the copy of 404/index.html to 404.html
// that build-site.yml makes. Run with `npm run acceptance:nginx`. Examples: docs/examples/home.md.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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

test('HOME-PAGE-06: the prerendered pages, the site root included, still answer 200', async () => {
  for (const path of ['/', '/en/home', '/de/home/']) {
    const response = await fetch(`${origin}${path}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${path} answers ${response.status}`);
    assert.ok(!html.includes('Page not found</h1>'), `${path} shows the 404 page`);
  }
});

test('HOME-PAGE-05: the old /home answers 301 to /en/home', async () => {
  const response = await fetch(`${origin}/home`, { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/en/home');
});

test('HOME-PAGE-05: every other old path answers 301 to its English page', async () => {
  for (const page of ['about', 'research', 'running', 'contact']) {
    const response = await fetch(`${origin}/${page}`, { redirect: 'manual' });
    assert.equal(response.status, 301, `/${page} answers ${response.status}`);
    assert.equal(response.headers.get('location'), `/en/${page}`);
  }
});
