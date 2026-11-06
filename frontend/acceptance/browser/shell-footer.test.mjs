// Acceptance test for the footer's colours, in a real browser, in both themes (D32). Run `npm run
// build` first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium of your own, as in
// shell-phone.test.mjs. Example: SHELL-07 in docs/examples/shell.md.
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
  '.xml': 'application/xml',
  '.txt': 'text/plain',
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

// Every element in the footer that holds text of its own, with its contrast against what is
// painted behind it: the first background up its ancestors, half-transparent ones laid over the
// next. A canvas turns any CSS colour (color-mix, oklab) into sRGB.
const footerContrasts = (page) =>
  page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const rgba = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const over = ([r, g, b, a], [R, G, B]) => [
      r * a + R * (1 - a),
      g * a + G * (1 - a),
      b * a + B * (1 - a),
      1,
    ];
    const background = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = rgba(getComputedStyle(e).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] === 1) break;
      }
      return layers.reduceRight((below, layer) => over(layer, below), [255, 255, 255, 1]);
    };
    const luminance = (c) => {
      const [r, g, b] = c.slice(0, 3).map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const footer = document.querySelector('footer');
    return [...footer.querySelectorAll('*'), footer]
      .filter((el) =>
        [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()),
      )
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const bg = background(el);
        const fg = over(rgba(getComputedStyle(el).color), bg);
        const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
        return {
          text: [...el.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .join(' ')
            .slice(0, 30),
          contrast: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
        };
      });
  });

for (const lang of ['en', 'de', 'pt']) {
  for (const theme of ['light', 'dark']) {
    test(`SHELL-07 C: on /${lang}/home (1280, ${theme}), every text in the footer is at 4.5:1 or more`, async () => {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: theme,
      });
      try {
        const page = await context.newPage();
        await page.goto(`${origin}/${lang}/home`, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
          timeout: 15000,
        });
        await page.evaluate(() => document.fonts.ready);
        const texts = await footerContrasts(page);
        assert.ok(
          texts.some(({ text }) => text === 'hello@zuacaldeira.com'),
          `the mail button is read: ${JSON.stringify(texts)}`,
        );
        assert.deepEqual(
          texts.filter(({ contrast }) => contrast < 4.5),
          [],
          JSON.stringify(texts),
        );
      } finally {
        await context.close();
      }
    });
  }
}
