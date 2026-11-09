// The Research page's results on the theorem band, in a real browser, light and dark (RS-COLOR-01,
// and RS-COLOR-04's band half; D19 in docs/examples/research.md). Run `npm run build` first, then
// `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium of your own, as in shell-phone.test.mjs.
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

// The results' ground and text colours, beside the band tokens as the page resolves them (a probe
// element painted with var(--zc-band-bg) and var(--zc-band-fg)).
const colours = (page) =>
  page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.background = 'var(--zc-band-bg)';
    probe.style.color = 'var(--zc-band-fg)';
    document.body.append(probe);
    const band = { bg: getComputedStyle(probe).backgroundColor, fg: getComputedStyle(probe).color };
    probe.remove();
    const results = document.querySelector('section.rs-results');
    const textColours = [...results.querySelectorAll('h2, p, span')].map((el) => getComputedStyle(el).color);
    return { band, bg: getComputedStyle(results).backgroundColor, fg: [...new Set(textColours)] };
  });

for (const theme of ['light', 'dark']) {
  test(`RS-COLOR-01, 04: on /en/research (1280, ${theme}), what it proves stands on the band, its texts at 4.5:1`, async () => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
    try {
      const page = await context.newPage();
      await page.goto(`${origin}/en/research`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, { timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      const { band, bg, fg } = await colours(page);
      assert.deepEqual({ bg, fg }, { bg: band.bg, fg: [band.fg] });
      const texts = await contrastsIn(page, 'section.rs-results');
      assert.ok(
        texts.some(({ text }) => text.startsWith('For every well-formed')),
        `the theorem is read: ${JSON.stringify(texts)}`,
      );
      assert.deepEqual(texts.filter(({ contrast }) => contrast < 4.5), [], JSON.stringify(texts));
    } finally {
      await context.close();
    }
  });
}
