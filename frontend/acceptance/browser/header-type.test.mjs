// Acceptance test for the header's type, in a real browser (SHELL-13c, D44 in docs/examples/shell.md):
// the desktop menu in IBM Plex Mono and the "zc" mark in Fraunces at 600, as the home mock-up, not in
// the Inter that Material's theme once set. Run `npm run build` first, then `npm run acceptance:browser`.
// CHROMIUM_PATH picks a Chromium of your own, as in shell-phone.test.mjs. Needs the network (Google Fonts).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const site = join(import.meta.dirname, '../../dist/zuacaldeira-com/browser');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const file = (url) => {
  const path = normalize(decodeURIComponent(new URL(url, 'http://x').pathname));
  const asFile = join(site, path);
  if (existsSync(asFile) && statSync(asFile).isFile()) return asFile;
  const asPage = join(site, path, 'index.html');
  return existsSync(asPage) ? asPage : join(site, '404/index.html');
};
const server = createServer((req, res) => {
  const f = file(req.url ?? '/');
  res.writeHead(200, { 'content-type': TYPES[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});

const chromiumPath = () => {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (existsSync(chromium.executablePath())) return undefined;
  const cache = join(homedir(), '.cache/ms-playwright');
  return (existsSync(cache) ? readdirSync(cache) : [])
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    .map((d) => join(cache, d, 'chrome-linux64/chrome'))
    .find(existsSync);
};

let browser;
let origin;
before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ executablePath: chromiumPath() });
});
after(async () => {
  await browser?.close();
  server.close();
});

// Chromium names a face with its weight ("IBM Plex Mono Medium"); a system font says so.
const FAMILIES = ['Fraunces', 'Archivo', 'IBM Plex Mono'];
const family = ({ familyName, isCustomFont }) =>
  (FAMILIES.find((f) => familyName === f || familyName.startsWith(`${f} `)) ?? familyName) +
  (isCustomFont ? '' : ' (system)');

// The families that drew the elements matching a selector, all of them together.
const familiesOf = async (cdp, rootId, selector) => {
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: rootId, selector });
  const used = new Set();
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    for (const f of fonts) used.add(family(f));
  }
  return nodeIds.length ? [...used].sort() : ['(none found)'];
};

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-13c: on /${lang}/home (1280, light) the menu is drawn in IBM Plex Mono, the "zc" mark in Fraunces at 600`, async () => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: 'light',
    });
    try {
      const page = await context.newPage();
      await page.goto(`${origin}/${lang}/home`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
        timeout: 15000,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.fonts].every((f) => f.status !== 'loading'));
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable');
      await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      const actual = {
        menu: await familiesOf(cdp, root.nodeId, '.desktop-menu-items a'),
        mark: await familiesOf(cdp, root.nodeId, '.logo-text'),
        markWeight: await page
          .locator('.logo-text')
          .evaluate((n) => getComputedStyle(n).fontWeight),
      };
      await cdp.detach();
      assert.deepEqual(actual, { menu: ['IBM Plex Mono'], mark: ['Fraunces'], markWeight: '600' });
    } finally {
      await context.close();
    }
  });
}
