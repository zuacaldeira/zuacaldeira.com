// The Research wall in a real browser: it draws in smallest first with motion, is complete at once
// with reduced motion or without JavaScript, and pointing names the protocol (RS-MOTION-01 to 04 in
// docs/examples/research.md). Run `npm run build` first, then `npm run acceptance:browser`.
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

// Opens /en/research at 1440. With JavaScript, waits until Angular has taken over the prerendered page.
const open = async ({ reducedMotion = 'no-preference', javaScriptEnabled = true } = {}) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion, javaScriptEnabled });
  const page = await context.newPage();
  await page.goto(`${origin}/en/research`, { waitUntil: javaScriptEnabled ? 'networkidle' : 'load' });
  if (javaScriptEnabled) {
    await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, { timeout: 15000 });
  }
  return { context, page };
};

// The wall as drawn: <html>'s motion, the wall's `in`, and each line's offset, delay and transition.
const drawing = (page) =>
  page.evaluate(() => {
    const svg = document.querySelector('app-research-wall svg');
    const lines = [...svg.querySelectorAll('line')].map((line) => getComputedStyle(line));
    return {
      motion: document.documentElement.classList.contains('motion'),
      in: svg.classList.contains('in'),
      firstDelay: parseFloat(lines[0].getPropertyValue('--d')),
      lastDelay: parseFloat(lines.at(-1).getPropertyValue('--d')),
      notDrawn: lines.filter((style) => parseFloat(style.strokeDashoffset) !== 0).length,
      // Under reduced motion the site sets every transition to 0.01 ms (styles.css): nothing visibly moves.
      moving: lines.filter((style) => parseFloat(style.transitionDuration) > 0.001).length,
      hiddenStates: [...svg.querySelectorAll('circle')].filter((c) => getComputedStyle(c).opacity !== '1').length,
    };
  });

test('RS-MOTION-01: with motion, the wall draws itself in, smallest lattice first, within 2 s', async () => {
  const { context, page } = await open();
  try {
    await page.waitForTimeout(2000);
    const drawn = await drawing(page);
    assert.ok(drawn.firstDelay < drawn.lastDelay, `the first tile starts before the last: ${JSON.stringify(drawn)}`);
    assert.deepEqual(
      { motion: drawn.motion, in: drawn.in, notDrawn: drawn.notDrawn, hiddenStates: drawn.hiddenStates },
      { motion: true, in: true, notDrawn: 0, hiddenStates: 0 },
    );
  } finally {
    await context.close();
  }
});

test('RS-MOTION-02: with reduced motion, the wall is complete at once and nothing moves', async () => {
  const { context, page } = await open({ reducedMotion: 'reduce' });
  try {
    const drawn = await drawing(page);
    assert.deepEqual(
      { motion: drawn.motion, notDrawn: drawn.notDrawn, moving: drawn.moving, hiddenStates: drawn.hiddenStates },
      { motion: false, notDrawn: 0, moving: 0, hiddenStates: 0 },
    );
  } finally {
    await context.close();
  }
});

test('RS-MOTION-03: without JavaScript, the wall is complete', async () => {
  const { context, page } = await open({ javaScriptEnabled: false });
  try {
    const drawn = await drawing(page);
    assert.deepEqual(
      { motion: drawn.motion, notDrawn: drawn.notDrawn, hiddenStates: drawn.hiddenStates },
      { motion: false, notDrawn: 0, hiddenStates: 0 },
    );
  } finally {
    await context.close();
  }
});

test('RS-MOTION-04: pointing at a tile names its protocol and thickens it; leaving the wall brings the sentence back', async () => {
  const { context, page } = await open({ reducedMotion: 'reduce' });
  try {
    // Read two frames after the pointer moved, once the site's 0.01 ms transitions have run.
    const read = () =>
      page.evaluate(async () => {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const hint = document.querySelector('app-research-wall figure p');
        const tile = document.querySelector('g[data-name="Two-Phase Commit"]');
        return {
          hint: hint.textContent.trim(),
          ariaHidden: hint.getAttribute('aria-hidden'),
          width: getComputedStyle(tile.querySelector('line')).strokeWidth,
          focusable: document.querySelectorAll('app-research-wall [tabindex], app-research-wall a, app-research-wall button').length,
        };
      });
    const before = await read();
    await page.hover('g[data-name="Two-Phase Commit"] rect');
    const pointed = await read();
    await page.mouse.move(5, 300);
    const left = await read();
    assert.deepEqual(
      { before, pointed, left },
      {
        before: { hint: 'Point at a tile to name its protocol.', ariaHidden: 'true', width: '1.6px', focusable: 0 },
        pointed: { hint: 'Two-Phase Commit', ariaHidden: 'true', width: '2.6px', focusable: 0 },
        left: { hint: 'Point at a tile to name its protocol.', ariaHidden: 'true', width: '1.6px', focusable: 0 },
      },
    );
  } finally {
    await context.close();
  }
});
