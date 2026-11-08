// Acceptance test for the Software page's screenshot, in a real browser, light and dark (SW-LEAD-06,
// D24). Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium
// of your own, as in shell-phone.test.mjs. Examples: docs/examples/software.md.
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

for (const theme of ['light', 'dark']) {
  test(`SW-LEAD-06 C: on /en/software (1280, ${theme}), exactly one screenshot shows, the ${theme} one`, async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
    try {
      const page = await context.newPage();
      const requested = [];
      page.on('request', (request) => {
        const shot = request.url().match(/reticulab-live-(light|dark)\.png$/)?.[1];
        if (shot) requested.push(shot);
      });
      await page.goto(`${origin}/en/software`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
        timeout: 15000,
      });
      // Bring the screenshot into view, so the lazy image of the theme loads.
      await page.locator('.sw-shot').scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () =>
          [...document.querySelectorAll('.sw-shot img')].some(
            (img) => img.checkVisibility() && img.complete && img.naturalWidth > 0,
          ),
        null,
        { timeout: 15000 },
      );
      await page.waitForLoadState('networkidle');
      const shown = await page.evaluate(() =>
        [...document.querySelectorAll('.sw-shot img')]
          .filter((img) => img.checkVisibility())
          .map((img) => img.getAttribute('src').match(/reticulab-live-(light|dark)\.png$/)[1]),
      );
      assert.deepEqual(shown, [theme]);
      // Open (D24): on a dark page the light image is downloaded too, before the theme is set;
      // `requested` is recorded for that check, which waits for the developer's decision.
      void requested;
    } finally {
      await context.close();
    }
  });
}
