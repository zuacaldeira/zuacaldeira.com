// Acceptance tests for the header as the mock-ups draw it, in a real browser (SHELL-14 to 17 in
// docs/examples/shell.md, D45 to D49): one 1200 px column for header, pages and footer, the menu at
// the right in its language's words, the contact button as a plain link.
// Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH as in shell-phone.
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

const HEIGHT = { 390: 844, 768: 1024, 1280: 900, 1440: 900 };

// Opens a page at a width (light), waits for Angular, the fonts and every transition, runs `read`.
const atWidth = async ({ route, width, dark = false }, read, arg) => {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT[width] ?? 900 } });
  try {
    await context.addInitScript((v) => localStorage.setItem('zc-theme', v), dark ? 'dark' : 'light');
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(width < 600 ? 'app-zc-nav-mobile header' : 'app-zc-nav-desktop header');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    return await page.evaluate(read, arg);
  } finally {
    await context.close();
  }
};

// home-spec.md: the column's left edge, 16 px at 390 (the Handset gutter), 24 at 768, 64 at
// 1280, 144 at 1440; its right edge the width less the same.
const EDGE = { 390: 16, 768: 24, 1280: 64, 1440: 144 };

// In the page: the left edges of the logo, the <h1> and the footer's content; the right edges of
// the bar's last control and of the footer's content.
const READ_EDGES = () => {
  const r = (el) => el.getBoundingClientRect();
  const header = document.querySelector('app-zc-nav-mobile header, app-zc-nav-desktop header');
  const controls = [...header.querySelectorAll('a, button')].filter((el) => r(el).width > 0);
  const col = document.querySelector('app-footer .foot__col');
  const pad = getComputedStyle(col);
  return {
    left: {
      logo: Math.round(r(header.querySelector('a.logo')).left),
      h1: Math.round(r(document.querySelector('main h1')).left),
      footer: Math.round(r(col).left + parseFloat(pad.paddingLeft)),
    },
    right: {
      bar: Math.round(Math.max(...controls.map((el) => r(el).right))),
      footer: Math.round(r(col).right - parseFloat(pad.paddingRight)),
    },
  };
};

for (const route of ['/en/software', '/de/writing', '/pt/research']) {
  for (const width of [390, 768, 1280, 1440]) {
    test(`SHELL-14 (D48): at ${width} on ${route}, header, heading and footer share the column's edges`, async () => {
      const e = EDGE[width];
      assert.deepEqual(await atWidth({ route, width }, READ_EDGES), {
        left: { logo: e, h1: e, footer: e },
        right: { bar: width - e, footer: width - e },
      });
    });
  }
}
