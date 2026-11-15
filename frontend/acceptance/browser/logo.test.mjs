// Acceptance tests for the logo in the header, in a real browser: the name's breakpoint, the mark's
// colours and contrast in the light and the night glaze, the link's size and focus. Run
// `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium of your
// own, as in shell-phone.test.mjs. Examples: docs/examples/logo.md, slice 1.
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

// A static server for the built site, as nginx serves it: /de/home is de/home/index.html.
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

// Opens a page at a width and glaze, after Angular has started, and hands it to `fn`.
const withPage = async ({ route = '/en/home', width, height = 900, theme = 'light' }, fn) => {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
      timeout: 15000,
    });
    await page.evaluate(() => document.fonts.ready);
    return await fn(page);
  } finally {
    await context.close();
  }
};

// Whether the header's home link shows its mark and its name: each drawn with a box of its own.
const shown = (page) =>
  page.evaluate(() => {
    const logo = document.querySelector('header a.logo');
    const drawn = (el) => !!el && el.getBoundingClientRect().width > 0 && el.checkVisibility();
    return {
      mark: drawn(logo?.querySelector('app-logo-mark svg')),
      name: drawn(logo?.querySelector('.logo-name')),
    };
  });

// The paint of each part of the header's mark, and the page's own tokens, all as `#rrggbb` (a canvas
// turns any CSS colour into sRGB).
const paint = (page) =>
  page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const hex = (css) => {
      if (!css || css === 'none') return css;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      return `#${[...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
    };
    const svg = document.querySelector('header a.logo app-logo-mark svg');
    const style = (selector, prop) => {
      const all = [...svg.querySelectorAll(selector)].map((el) =>
        hex(getComputedStyle(el)[prop]),
      );
      return [...new Set(all)].join(' ');
    };
    const root = getComputedStyle(document.documentElement);
    return {
      parts: {
        edges: style('line', 'stroke'),
        atoms: style('circle.atom', 'fill'),
        top: style('circle.top', 'fill'),
        bottomRing: style('circle.bottom', 'stroke'),
        bottomFill: style('circle.bottom', 'fill'),
      },
      tokens: Object.fromEntries(
        ['--zc-azul', '--zc-ochre-text', '--zc-bg-warm'].map((t) => [
          t,
          hex(root.getPropertyValue(t).trim()),
        ]),
      ),
    };
  });

for (const theme of ['light', 'dark']) {
  test(`LOGO-06: in the ${theme} glaze the mark is painted from the page's tokens: azul, ⊤ in the text ochre (D1), ⊥ open`, async () => {
    const { parts, tokens } = await withPage({ width: 1280, theme }, paint);
    assert.deepEqual(parts, {
      edges: tokens['--zc-azul'],
      atoms: tokens['--zc-azul'],
      top: tokens['--zc-ochre-text'],
      bottomRing: tokens['--zc-azul'],
      bottomFill: tokens['--zc-bg-warm'],
    });
  });
}

// The contrast of each part of the header's mark (its stroke or fill) and of the name against what
// is painted behind the link: the first backgrounds up its ancestors, half-transparent ones laid
// over the next (as contrast.mjs does for text).
const contrasts = (page) =>
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
    const luminance = (c) => {
      const [r, g, b] = c.slice(0, 3).map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const logo = document.querySelector('header a.logo');
    const layers = [];
    for (let e = logo; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] === 1) break;
    }
    const bg = layers.reduceRight((below, layer) => over(layer, below), [255, 255, 255, 1]);
    const ratio = (css) => {
      const [l1, l2] = [luminance(over(rgba(css), bg)), luminance(bg)].sort((a, b) => b - a);
      return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
    };
    const of = (selector, prop) => ratio(getComputedStyle(logo.querySelector(selector))[prop]);
    return {
      edges: of('line', 'stroke'),
      atoms: of('circle.atom', 'fill'),
      top: of('circle.top', 'fill'),
      bottomRing: of('circle.bottom', 'stroke'),
      name: of('.logo-name', 'color'),
    };
  });

for (const theme of ['light', 'dark']) {
  test(`LOGO-07: in the ${theme} glaze each part of the mark stands at 3:1 or more, the name at 4.5:1 or more`, async (t) => {
    const found = await withPage({ width: 1280, theme }, contrasts);
    t.diagnostic(JSON.stringify(found));
    const low = Object.entries(found)
      .filter(([part, ratio]) => ratio < (part === 'name' ? 4.5 : 3))
      .map(([part, ratio]) => `${part} ${ratio}`);
    assert.deepEqual(low, [], JSON.stringify(found));
  });
}

test('LOGO-04: the desktop bar shows the mark alone at 768 px, the mark and the name at 1280 px', async () => {
  const at768 = await withPage({ width: 768, height: 1024 }, shown);
  const at1280 = await withPage({ width: 1280 }, shown);
  assert.deepEqual(
    { at768, at1280 },
    { at768: { mark: true, name: false }, at1280: { mark: true, name: true } },
  );
});
