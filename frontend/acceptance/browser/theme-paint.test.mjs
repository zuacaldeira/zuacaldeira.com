// Acceptance test for the theme at first paint, in a real browser (THEME-10, D25). The page's
// script files are blocked, so Angular never runs: whatever theme the page has, the head's inline
// script set it before first paint. Run `npm run build` first, then `npm run acceptance:browser`.
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
  '.png': 'image/png',
  '.ico': 'image/x-icon',
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

// Opens a page with Angular's scripts blocked; is <html> dark?
const darkBeforeAngular = async ({ device, saved, javaScript = true }) => {
  const context = await browser.newContext({ colorScheme: device, javaScriptEnabled: javaScript });
  try {
    if (saved) await context.addInitScript((value) => localStorage.setItem('zc-theme', value), saved);
    await context.route(/\.js$/, (route) => route.abort());
    const page = await context.newPage();
    await page.goto(`${origin}/en/software`, { waitUntil: 'load' });
    // Awaited here, or `finally` closes the context before the page answers.
    return await page.evaluate(() => document.documentElement.classList.contains('dark-theme'));
  } finally {
    await context.close();
  }
};

for (const [device, saved, dark] of [
  ['dark', null, true],
  ['dark', 'light', false],
  ['light', 'dark', true],
  ['light', null, false],
]) {
  test(`THEME-10 C3: a ${device} device, saved ${saved}, is ${dark ? 'dark' : 'light'} before Angular runs`, async () => {
    assert.equal(await darkBeforeAngular({ device, saved }), dark);
  });
}

test('THEME-10 C4: with JavaScript off, a dark device sees the light page', async () => {
  assert.equal(await darkBeforeAngular({ device: 'dark', javaScript: false }), false);
});
