// The Research page in a real browser: on a phone, by keyboard, its contrast, grounds and rules in
// light and dark (RS-PAGE-09 to 12, RS-COLOR-02 to 04, D24 in docs/examples/research.md), and the
// hidden new-tab words (BUG-RS-01). Run `npm run build` first, then `npm run acceptance:browser`.
// CHROMIUM_PATH picks a Chromium of your own, as in shell-phone.test.mjs.
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
  test(`RS-PAGE-09: /${lang}/research fits a 390 px phone: no sideways scroll, nothing in main past 390`, async () => {
    const { context, page } = await open(`/${lang}/research`, 390);
    try {
      const measured = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        past: [...document.querySelectorAll('main *')]
          .filter((el) => el.getClientRects().length > 0 && !el.closest('.visually-hidden'))
          .filter((el) => el.getBoundingClientRect().right > 390.5)
          .map((el) => `${el.tagName.toLowerCase()}.${el.getAttribute('class')} ${Math.round(el.getBoundingClientRect().right)}`),
      }));
      assert.deepEqual(measured, { page: 390, past: [] });
    } finally {
      await context.close();
    }
  });
}

test('RS-PAGE-10: every link and the button on the Research page are at least 44 px tall at 390 px', async () => {
  for (const lang of ['en', 'de', 'pt']) {
    const { context, page } = await open(`/${lang}/research`, 390);
    try {
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('main a')]
          .filter((el) => el.getClientRects().length > 0)
          .map((el) => ({ text: el.textContent.trim().slice(0, 30), height: el.getBoundingClientRect().height })),
      );
      assert.equal(links.length, 4, `/${lang}/research: the PDF button, the tool's link and the two closing links`);
      assert.deepEqual(links.filter(({ height }) => height < 44), [], `/${lang}/research`);
    } finally {
      await context.close();
    }
  }
});

for (const width of [390, 1280]) {
  test(`RS-PAGE-11: on /de/research at ${width} px, Tab then Enter moves focus to the main content`, async () => {
    const { context, page } = await open('/de/research', width);
    try {
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
      assert.equal(first, 'Zum Hauptinhalt springen');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.activeElement?.id === 'main-content', null, { timeout: 5000 });
      assert.equal(new URL(page.url()).pathname, '/de/research');
    } finally {
      await context.close();
    }
  });
}

for (const lang of ['en', 'de']) {
  for (const theme of ['light', 'dark']) {
    test(`RS-PAGE-12: on /${lang}/research (1280, ${theme}), every text in main is at 4.5:1 or more`, async () => {
      const { context, page } = await open(`/${lang}/research`, 1280, theme);
      try {
        const texts = await contrastsIn(page, 'main');
        assert.ok(texts.length > 30, `the page's texts are read: ${texts.length}`);
        assert.deepEqual(texts.filter(({ contrast }) => contrast < 4.5), [], JSON.stringify(texts.slice(0, 5)));
      } finally {
        await context.close();
      }
    });
  }
}

// A token's colour as the page resolves it: a probe painted with it, its computed colour.
const tokens = (page, names) =>
  page.evaluate((names) => {
    const probe = document.createElement('div');
    document.body.append(probe);
    const resolved = Object.fromEntries(
      names.map((name) => {
        probe.style.color = `var(${name})`;
        return [name, getComputedStyle(probe).color];
      }),
    );
    probe.remove();
    return resolved;
  }, names);

for (const theme of ['light', 'dark']) {
  test(`RS-COLOR-02, 03 (D23): on /en/research (1280, ${theme}), the tool on the raised glaze, 15's rule ochre`, async () => {
    const { context, page } = await open('/en/research', 1280, theme);
    try {
      const t = await tokens(page, ['--zc-bg-light', '--zc-azul', '--zc-ochre']);
      const shown = await page.evaluate(() => ({
        tool: getComputedStyle(document.querySelector('section.rs-tool')).backgroundColor,
        rules: [...document.querySelectorAll('.rs-checks__figure')].map((el) => getComputedStyle(el).borderTopColor),
      }));
      assert.deepEqual(shown, {
        tool: t['--zc-bg-light'],
        rules: [t['--zc-azul'], t['--zc-azul'], t['--zc-ochre'], t['--zc-azul']],
      });
    } finally {
      await context.close();
    }
  });
}

for (const theme of ['light', 'dark']) {
  test(`RS-COLOR-05 (D28): on /en/research (1280, ${theme}), the paper card has a plain thin border, ochre only in its small touches`, async () => {
    const { context, page } = await open('/en/research', 1280, theme);
    try {
      const t = await tokens(page, ['--zc-border-light', '--zc-ochre-text', '--zc-ochre']);
      const shown = await page.evaluate(() => {
        const card = getComputedStyle(document.querySelector('.rs-paper__card'));
        return {
          borders: ['Top', 'Right', 'Bottom', 'Left'].map(
            (side) => `${card[`border${side}Width`]} ${card[`border${side}Color`]}`,
          ),
          kind: getComputedStyle(document.querySelector('.rs-paper__kind')).color,
          lozenge: getComputedStyle(document.querySelector('.rs-paper__note'), '::before').backgroundColor,
        };
      });
      assert.deepEqual(shown, {
        borders: Array(4).fill(`1px ${t['--zc-border-light']}`),
        kind: t['--zc-ochre-text'],
        lozenge: t['--zc-ochre'],
      });
    } finally {
      await context.close();
    }
  });
}

for (const theme of ['light', 'dark']) {
  // The lattice half left with the wall (D26).
  test(`RS-COLOR-04 (D24): on /de/research (1280, ${theme}), the band's texts at 4.5:1`, async () => {
    const { context, page } = await open('/de/research', 1280, theme);
    try {
      const band = await contrastsIn(page, 'section.rs-results');
      assert.ok(band.some(({ text }) => text.startsWith('For every well-formed')), 'the band is read');
      assert.deepEqual(band.filter(({ contrast }) => contrast < 4.5), [], JSON.stringify(band));
    } finally {
      await context.close();
    }
  });
}

test('BUG-RS-01 (RS-MORE-02): the new-tab words of the ResearchGate link are for screen readers, not on screen', async () => {
  const { context, page } = await open('/de/research', 1280);
  try {
    const hidden = await page.evaluate(() => {
      const span = document.querySelector('section.rs-more a[target="_blank"] .visually-hidden');
      const box = span?.getBoundingClientRect();
      return { text: span?.textContent?.trim(), width: Math.round(box?.width ?? -1), height: Math.round(box?.height ?? -1) };
    });
    assert.deepEqual(hidden, { text: '(öffnet in einem neuen Tab)', width: 1, height: 1 });
  } finally {
    await context.close();
  }
});
