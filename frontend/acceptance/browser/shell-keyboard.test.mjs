// Acceptance test for the skip link, in a real browser, at the phone's and the desktop's width and in
// both themes. Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a
// Chromium of your own, as in shell-phone.test.mjs.
// Examples: SHELL-10, SHELL-12 and their protocol rows in docs/examples/shell.md.
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

const WIDTHS = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 800 } };
const SKIP = {
  en: 'Skip to main content',
  de: 'Zum Hauptinhalt springen',
  pt: 'Saltar para o conteúdo principal',
};

// Opens `route` at `width` in `theme` (the visitor's system setting) after Angular has started:
// hydration has taken the `ngh` marks off the prerendered elements. A marker on `window` tells
// whether the document was loaded again.
const withPage = async (route, width, theme, fn) => {
  const context = await browser.newContext({ viewport: WIDTHS[width], colorScheme: theme });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
      timeout: 15000,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => (window.zcSameDocument = true));
    return await fn(page);
  } finally {
    await context.close();
  }
};

// The focused element as G sees it, the skip link's box and contrast, and the page's state.
const readFocus = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    const main = document.querySelector('main');
    const focus =
      !el || el === document.body
        ? 'body'
        : el.matches('a.skip-link')
          ? 'skip link'
          : el.matches('header a.logo')
            ? 'logo'
            : el.matches('header button.menu-button')
              ? 'menu button'
          : el === main
            ? 'main'
            : main?.contains(el)
              ? 'in main'
              : `other: ${el.tagName.toLowerCase()} ${el.textContent.trim().slice(0, 30)}`;
    const link = document.querySelector('a.skip-link');
    const box = link.getBoundingClientRect();
    const rgb = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
    const luminance = (c) => {
      const [r, g, b] = rgb(c).map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const style = getComputedStyle(link);
    const [l1, l2] = [luminance(style.color), luminance(style.backgroundColor)].sort((a, b) => b - a);
    return {
      focus,
      text: link.textContent.trim(),
      inView:
        box.width > 0 &&
        box.top >= 0 &&
        box.left >= 0 &&
        box.bottom <= innerHeight &&
        box.right <= innerWidth,
      // Any part of it on the screen: a link that peeks out a few pixels is not out of view.
      seen:
        box.width > 0 &&
        box.bottom > 0 &&
        box.right > 0 &&
        box.top < innerHeight &&
        box.left < innerWidth,
      contrast: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
      path: location.pathname,
      lang: document.documentElement.lang,
      sameDocument: window.zcSameDocument === true,
    };
  });

for (const lang of ['en', 'de', 'pt']) {
  for (const width of ['phone', 'desktop']) {
    for (const theme of ['light', 'dark']) {
      test(`SHELL-10: on /${lang}/home (${width}, ${theme}), the first Tab shows the skip link and following it moves focus to main`, async () => {
        const [tab, follow, next] = await withPage(`/${lang}/home`, width, theme, async (page) => {
          await page.keyboard.press('Tab');
          const tab = await readFocus(page);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(400);
          const follow = await readFocus(page);
          await page.keyboard.press('Tab');
          return [tab, follow, await readFocus(page)];
        });
        const where = { path: `/${lang}/home`, lang, sameDocument: true };
        assert.deepEqual(
          {
            tab: { focus: tab.focus, text: tab.text, inView: tab.inView, readable: tab.contrast >= 4.5 }, // A1, A2
            follow: { focus: follow.focus, path: follow.path, lang: follow.lang, sameDocument: follow.sameDocument }, // A3, P-04
            next: next.focus, // A4
          },
          {
            tab: { focus: 'skip link', text: SKIP[lang], inView: true, readable: true },
            follow: { focus: 'main', ...where },
            next: 'in main',
          },
          JSON.stringify({ tab, follow, next }),
        );
      });
    }
  }
}

for (const lang of ['en', 'de', 'pt']) {
  for (const width of ['phone', 'desktop']) {
    test(`SHELL-10 A6: on /${lang}/home (${width}), a second Tab passes the skip link for the logo and hides it again`, async () => {
      const next = await withPage(`/${lang}/home`, width, 'light', async (page) => {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        return readFocus(page);
      });
      assert.deepEqual(
        { focus: next.focus, seen: next.seen, path: next.path },
        { focus: 'logo', seen: false, path: `/${lang}/home` },
        JSON.stringify(next),
      );
    });
  }
}

// SHELL-12 (D9): the phone menu, opened as in shell-phone.test.mjs: acted on only once Material has
// moved focus into the drawer.
for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-12: on a phone, following About in the menu on /${lang}/home leaves focus on /${lang}/about's main`, async () => {
    const state = await withPage(`/${lang}/home`, 'phone', 'light', async (page) => {
      await page.click('app-zc-nav-mobile header button.menu-button');
      await page.waitForSelector('mat-sidenav.mat-drawer-opened');
      await page.waitForFunction(() =>
        document.querySelector('mat-sidenav').contains(document.activeElement),
      );
      await page.click(`mat-sidenav nav a[href="/${lang}/about"]`);
      await page.waitForTimeout(800); // longer than the drawer's slide
      const open = await page.evaluate(() =>
        document.querySelector('mat-sidenav').classList.contains('mat-drawer-opened'),
      );
      return { open, ...(await readFocus(page)) };
    });
    assert.deepEqual(
      { open: state.open, focus: state.focus, path: state.path },
      { open: false, focus: 'main', path: `/${lang}/about` },
      JSON.stringify(state),
    );
  });
}

// The protocol rows: each a page outside G, so the test goes red.
for (const lang of ['en', 'de', 'pt']) {
  for (const width of ['phone', 'desktop']) {
    test(`SHELL-10-P-01: on /${lang}/home (${width}), before any Tab no part of the skip link shows`, async () => {
      const state = await withPage(`/${lang}/home`, width, 'light', readFocus);
      assert.deepEqual(
        { focus: state.focus, seen: state.seen },
        { focus: 'body', seen: false },
        JSON.stringify(state),
      );
    });
  }
}
