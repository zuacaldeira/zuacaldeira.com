// Acceptance tests for the Software page on a phone and by keyboard, in a real browser
// (SW-PAGE-11 to 13). Run `npm run build` first, then `npm run acceptance:browser`.
// CHROMIUM_PATH picks a Chromium of your own, as in shell-phone.test.mjs.
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

// Opens a page at a width, once Angular has taken over the prerendered page.
const open = async (path, width) => {
  const context = await browser.newContext({ viewport: { width, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
};

for (const lang of ['en', 'de', 'pt']) {
  test(`SW-PAGE-11: /${lang}/software fits a 390 px phone: no sideways scroll, no <pre> scrolls`, async () => {
    const { context, page } = await open(`/${lang}/software`, 390);
    try {
      const measured = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        pres: [...document.querySelectorAll('pre')]
          .filter((pre) => pre.scrollWidth > pre.clientWidth)
          .map((pre) => pre.textContent.slice(0, 30)),
      }));
      assert.deepEqual(measured, { page: 390, pres: [] });
    } finally {
      await context.close();
    }
  });
}

test('SW-PAGE-12: every link and button on the Software page is at least 44 px tall at 390 px', async () => {
  for (const lang of ['en', 'de', 'pt']) {
    const { context, page } = await open(`/${lang}/software`, 390);
    try {
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('main a, main button')]
          .filter((el) => el.getClientRects().length > 0)
          .map((el) => ({ text: el.textContent.trim().slice(0, 30), height: el.getBoundingClientRect().height }))
          .filter(({ height }) => height < 44),
      );
      assert.deepEqual(small, [], `/${lang}/software`);
    } finally {
      await context.close();
    }
  }
});

for (const width of [390, 1280]) {
  test(`SW-PAGE-13: on /de/software at ${width} px, Tab then Enter moves focus to the main content`, async () => {
    const { context, page } = await open('/de/software', width);
    try {
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
      assert.equal(first, 'Zum Hauptinhalt springen');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.activeElement?.id === 'main-content', null, { timeout: 5000 });
      assert.equal(new URL(page.url()).pathname, '/de/software');
    } finally {
      await context.close();
    }
  });
}
