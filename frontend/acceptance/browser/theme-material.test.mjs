// Acceptance tests for Material under the living glaze, in a real browser (slice 2 of
// docs/examples/theme.md: THEME-11, THEME-18). Material's components must paint with the glaze's
// tokens, whatever glaze the page has. Until slice 3 nothing changes the glaze at runtime, so for
// 06:30, 19:00 and 20:00 the test writes the engine's tokens on <html> itself (and `dark-theme` by
// the glaze's mode); light and dark come from the stored choice, as a visitor's would.
// Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH as in shell-phone.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';
import { themeAt } from '../../src/app/services/glaze.mjs';

const site = join(import.meta.dirname, '../../dist/zuacaldeira-com/browser');
const table = JSON.parse(
  readFileSync(join(import.meta.dirname, '../../src/app/services/glaze.json'), 'utf8'),
);
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

// The five states: the stored light and dark, and three glazes of the day written by the engine.
const glazeAt = (minute) => {
  const { hex, mode } = themeAt(table, minute);
  const tokens = Object.entries(table.map).flatMap(([k, names]) => names.map((n) => [n, hex[k]]));
  return { tokens, dark: mode === 'dark' };
};
const STATES = [
  { name: 'light', saved: 'light' },
  { name: 'dark', saved: 'dark' },
  { name: '06:30', saved: 'light', glaze: glazeAt(390) },
  { name: '19:00', saved: 'light', glaze: glazeAt(1140) },
  { name: '20:00', saved: 'light', glaze: glazeAt(1200) },
];

// Opens the page in a state, waits for Angular and every transition, then runs `read` in the page.
const inState = async ({ width, state, route = '/en/software' }, read) => {
  const context = await browser.newContext({ viewport: { width, height: 844 } });
  try {
    await context.addInitScript((value) => localStorage.setItem('zc-theme', value), state.saved);
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(width < 600 ? 'app-zc-nav-mobile header' : 'app-zc-nav-desktop header');
    if (state.glaze) {
      await page.evaluate(({ tokens, dark }) => {
        const html = document.documentElement;
        for (const [name, value] of tokens) html.style.setProperty(name, value);
        html.classList.toggle('dark-theme', dark);
      }, state.glaze);
    }
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    return await page.evaluate(read);
  } finally {
    await context.close();
  }
};

// In the page: what an element paints, beside what a token resolves to in the same place.
const READ_BUTTONS = () => {
  const resolve = (inside, token) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${token})`;
    inside.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const bar = document.querySelector('app-zc-nav-mobile header, app-zc-nav-desktop header');
  const toolbar = bar.querySelector('mat-toolbar');
  const cta = bar.querySelector('.nav-cta');
  const glyph = (selector) => {
    const icon = bar.querySelector(`${selector} mat-icon`);
    return icon && getComputedStyle(icon).color;
  };
  return {
    painted: {
      ctaGround: cta && getComputedStyle(cta).backgroundColor,
      ctaLabel: cta && getComputedStyle(cta).color,
      toggle: glyph('app-theme-toggle'),
      menu: glyph('.menu-button'),
    },
    tokens: {
      accent: resolve(toolbar, '--zc-accent'),
      onAccent: resolve(toolbar, '--zc-on-accent'),
      ink: resolve(toolbar, '--nav-fg'),
    },
  };
};

// In the page: the grounds of the layers Material puts around <main>, and the first opaque ground
// behind <main>, beside the glaze's ground resolved on the same page.
const READ_GROUNDS = () => {
  const ground = (el) => (el ? getComputedStyle(el).backgroundColor : 'absent');
  const probe = document.createElement('span');
  probe.style.color = 'var(--zc-bg-warm)';
  document.body.append(probe);
  const warm = getComputedStyle(probe).color;
  probe.remove();
  let behind = document.querySelector('main');
  while (behind && ['rgba(0, 0, 0, 0)', 'transparent'].includes(ground(behind))) {
    behind = behind.parentElement;
  }
  return {
    warm,
    layers: {
      body: ground(document.body),
      container: ground(document.querySelector('mat-sidenav-container')),
      content: ground(document.querySelector('mat-sidenav-content')),
    },
    behindMain: behind ? ground(behind) : 'none',
  };
};

for (const state of STATES) {
  for (const width of [390, 1280]) {
    test(`THEME-18: at ${width} in ${state.name}, the ground behind the page is the glaze's`, async () => {
      const { warm, layers, behindMain } = await inState({ width, state }, READ_GROUNDS);
      const ok = (g) => [warm, 'rgba(0, 0, 0, 0)', 'absent'].includes(g);
      assert.deepEqual(
        { layers: Object.entries(layers).filter(([, g]) => !ok(g)), behindMain },
        { layers: [], behindMain: warm },
      );
    });
  }

  test(`THEME-11: at 1280 in ${state.name}, the header's filled button is the accent with its label, the toggle the bar's ink`, async () => {
    const { painted, tokens } = await inState({ width: 1280, state }, READ_BUTTONS);
    assert.deepEqual(
      { ctaGround: painted.ctaGround, ctaLabel: painted.ctaLabel, toggle: painted.toggle },
      { ctaGround: tokens.accent, ctaLabel: tokens.onAccent, toggle: tokens.ink },
    );
  });

  test(`THEME-11: at 390 in ${state.name}, the phone bar's icon buttons draw in the bar's ink`, async () => {
    const { painted, tokens } = await inState({ width: 390, state }, READ_BUTTONS);
    assert.deepEqual(
      { toggle: painted.toggle, menu: painted.menu },
      { toggle: tokens.ink, menu: tokens.ink },
    );
  });
}
