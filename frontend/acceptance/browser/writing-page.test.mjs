// Acceptance tests for the Writing page in a real browser: on a phone, by keyboard, and the list's
// contrast in light and dark (WR-PAGE-11 to 13, WR-LIST-14 in docs/examples/writing.md).
// Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium of
// your own, as in shell-phone.test.mjs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
import { contrastsIn } from './contrast.mjs';

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
  '.pdf': 'application/pdf',
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

// Opens a page at a width and theme, once Angular has taken over the prerendered page.
const open = async (path, width, colorScheme = 'light') => {
  const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme });
  const page = await context.newPage();
  await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
};

for (const lang of ['en', 'de', 'pt']) {
  test(`WR-PAGE-11: /${lang}/writing fits a 390 px phone: no sideways scroll, nothing in main past 390`, async () => {
    const { context, page } = await open(`/${lang}/writing`, 390);
    try {
      const measured = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        past: [...document.querySelectorAll('main *')]
          .filter((el) => el.getClientRects().length > 0)
          .filter((el) => el.getBoundingClientRect().right > 390.5)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className} ${Math.round(el.getBoundingClientRect().right)}`),
      }));
      assert.deepEqual(measured, { page: 390, past: [] });
    } finally {
      await context.close();
    }
  });
}

test('WR-PAGE-12: every link on the Writing page is at least 44 px tall at 390 px', async () => {
  for (const lang of ['en', 'de', 'pt']) {
    const { context, page } = await open(`/${lang}/writing`, 390);
    try {
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('main a')]
          .filter((el) => el.getClientRects().length > 0)
          .map((el) => ({ text: el.textContent.trim().slice(0, 30), height: el.getBoundingClientRect().height })),
      );
      assert.equal(links.length, 4, `/${lang}/writing: the four texts' links are read`);
      assert.deepEqual(links.filter(({ height }) => height < 44), [], `/${lang}/writing`);
    } finally {
      await context.close();
    }
  }
});

for (const width of [390, 1280]) {
  test(`WR-PAGE-13: on /de/writing at ${width} px, Tab then Enter moves focus to the main content`, async () => {
    const { context, page } = await open('/de/writing', width);
    try {
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
      assert.equal(first, 'Zum Hauptinhalt springen');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.activeElement?.id === 'main-content', null, { timeout: 5000 });
      assert.equal(new URL(page.url()).pathname, '/de/writing');
    } finally {
      await context.close();
    }
  });
}

for (const lang of ['en', 'de']) {
  for (const theme of ['light', 'dark']) {
    test(`WR-LIST-14: on /${lang}/writing (1280, ${theme}), every text in the list is at 4.5:1 or more`, async () => {
      const { context, page } = await open(`/${lang}/writing`, 1280, theme);
      try {
        const texts = await contrastsIn(page, 'section.wr-texts');
        assert.ok(
          texts.some(({ text }) => text.startsWith('Session Type State Spaces')),
          `the list is read: ${JSON.stringify(texts)}`,
        );
        assert.deepEqual(texts.filter(({ contrast }) => contrast < 4.5), [], JSON.stringify(texts));
      } finally {
        await context.close();
      }
    });
  }
}
