// Acceptance test for the phone bar, in a real browser: the prerendered HTML holds the desktop bar
// only, so the phone bar exists only after Angular has started (D4 in shell.md). Run `npm run build`
// first, then `npm run acceptance:browser`. CHROMIUM_PATH picks a Chromium of your own; without
// it, playwright-core's (CI: `npx playwright-core install --with-deps --only-shell chromium`).
// Examples: SHELL-06, SHELL-08 and their protocol rows in docs/examples/shell.md.
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

// CHROMIUM_PATH, else playwright-core's own Chromium, else the newest one in ~/.cache/ms-playwright
// (a Chromium another Playwright installed on this machine).
const chromiumPath = () => {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (existsSync(chromium.executablePath())) return undefined;
  const cache = join(homedir(), '.cache/ms-playwright');
  const found = (existsSync(cache) ? readdirSync(cache) : [])
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    .map((d) => join(cache, d, 'chrome-linux64/chrome'))
    .find(existsSync);
  return found;
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

// What a visitor sees in the phone bar, after Angular has started: the controls from left to right
// with their visible boxes, the bar's and the page's widths, the bar's text and the headers.
const readPhoneBar = async (route) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('app-zc-nav-mobile header', { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.evaluate(() => {
      const bar = document.querySelector('app-zc-nav-mobile header');
      const name = (el) =>
        el.closest('app-theme-toggle')
          ? 'theme'
          : el.matches('a.logo')
            ? 'mark'
            : el.hasAttribute('hreflang')
              ? el.textContent.trim()
              : el.textContent.trim() === 'menu'
                ? 'menu'
                : el.outerHTML.slice(0, 60);
      const controls = [...bar.querySelectorAll('a, button')]
        .map((el) => ({ el, box: el.getBoundingClientRect() }))
        .sort((a, b) => a.box.left - b.box.left)
        .map(({ el, box }) => ({ name: name(el), width: box.width, height: box.height }));
      return {
        order: controls.map((c) => c.name),
        small: controls
          .filter((c) => c.width < 44 || c.height < 44)
          .map((c) => `${c.name} ${c.width}×${c.height}`),
        // Not the header's own box, which is always the viewport's width: what it holds. A bar that
        // overflows is clipped, so the page does not scroll; its last controls are just gone.
        barRight: Math.max(
          bar.scrollWidth,
          ...[...bar.querySelectorAll('*')].map((el) => el.getBoundingClientRect().right),
        ),
        pageWidth: document.documentElement.scrollWidth,
        name: bar.textContent.includes('Zua Caldeira'),
        headers: document.querySelectorAll('header').length,
      };
    });
  } finally {
    await page.close();
  }
};

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-06: on a phone, /${lang}/home's bar is mark, EN DE PT, theme, menu, each 44 px, within 390 px`, async () => {
    const bar = await readPhoneBar(`/${lang}/home`);
    assert.deepEqual(
      {
        order: bar.order, // A1, P-04
        small: bar.small, // A2, P-01
        barFits: bar.barRight <= 390, // A3, P-02
        pageFits: bar.pageWidth <= 390, // A3, P-02
        name: bar.name, // A4, P-03
        headers: bar.headers, // A5, P-05
      },
      {
        order: ['mark', 'EN', 'DE', 'PT', 'theme', 'menu'],
        small: [],
        barFits: true,
        pageFits: true,
        name: false,
        headers: 1,
      },
      JSON.stringify(bar),
    );
  });
}

// SHELL-08: the phone's menu. Opens /l/home at 390 px after Angular has started, taps the menu
// button and waits until the drawer has finished sliding in; `fn` then reads or acts on the page.
const withMenu = async (route, fn) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('app-zc-nav-mobile header', { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    await page.click('app-zc-nav-mobile header button.menu-button');
    await page.waitForSelector('mat-sidenav.mat-drawer-opened');
    await settled(page);
    // Open in G's sense: Material has moved focus into the drawer (after the slide, a tick later)
    // and so has noted the menu button to give it back to.
    await page.waitForFunction(() =>
      document.querySelector('mat-sidenav').contains(document.activeElement),
    );
    return await fn(page);
  } finally {
    await page.close();
  }
};

// Until the drawer's slide has ended. Material marks it with mat-drawer-animating from the moment
// it opens or closes; the transition itself may not have started yet, so the class is the signal.
const settled = (page) =>
  page.waitForFunction(() => {
    const drawer = document.querySelector('mat-sidenav');
    return !drawer.classList.contains('mat-drawer-animating') && drawer.getAnimations().length === 0;
  });

// The menu as a visitor reads it: the dialog's name and box, the nav's name, and each link's
// label (without its icon), href and height.
const readMenu = (page) =>
  page.evaluate(() => {
    const drawer = document.querySelector('mat-sidenav');
    const box = drawer.getBoundingClientRect();
    const label = (a) => {
      const copy = a.cloneNode(true);
      copy.querySelectorAll('mat-icon').forEach((icon) => icon.remove());
      return copy.textContent.trim();
    };
    const links = [...drawer.querySelectorAll('nav a')];
    return {
      role: drawer.getAttribute('role'),
      name: drawer.getAttribute('aria-label'),
      navName: drawer.querySelector('nav')?.getAttribute('aria-label'),
      left: box.left,
      right: box.right,
      links: links.map((a) => `${label(a)} ${a.getAttribute('href')}`),
      low: links.filter((a) => a.getBoundingClientRect().height < 44).map(label),
    };
  });

const MENU = {
  en: { name: 'Menu', nav: 'Main', labels: ['Home', 'About', 'Research', 'Running', 'Contact'] },
  de: {
    name: 'Menü',
    nav: 'Hauptnavigation',
    labels: ['Startseite', 'Über mich', 'Forschung', 'Laufen', 'Kontakt'],
  },
  pt: {
    name: 'Menu',
    nav: 'Navegação principal',
    labels: ['Início', 'Sobre', 'Investigação', 'Corrida', 'Contacto'],
  },
};
const PAGES = ['home', 'about', 'research', 'running', 'contact'];

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-08 A1: on a phone, /${lang}/home's menu slides in from the right, named, with five links, each 44 px high`, async () => {
    const menu = await withMenu(`/${lang}/home`, readMenu);
    assert.deepEqual(
      {
        role: menu.role,
        name: menu.name,
        navName: menu.navName,
        fromRight: Math.round(menu.right) === 390 && menu.left > 0,
        links: menu.links,
        low: menu.low,
      },
      {
        role: 'dialog',
        name: MENU[lang].name,
        navName: MENU[lang].nav,
        fromRight: true,
        links: PAGES.map((p, i) => `${MENU[lang].labels[i]} /${lang}/${p}`),
        low: [],
      },
      JSON.stringify(menu),
    );
  });
}

// The menu's state as G sees it: open or closed, which element has focus, and the URL.
const readState = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    const focus =
      !el || el === document.body
        ? 'body'
        : el.matches('app-zc-nav-mobile header button.menu-button')
          ? 'menu button'
          : el.closest('mat-sidenav')
            ? `in menu: ${el.textContent.trim().slice(0, 30)}`
            : `page: ${el.tagName.toLowerCase()} ${el.textContent.trim().slice(0, 30)}`;
    return {
      open: document.querySelector('mat-sidenav').classList.contains('mat-drawer-opened'),
      focus,
      path: location.pathname,
    };
  });

// `act` is a step of the visitor; the state is read once the drawer has had time to slide (or not).
const stateAfter = async (page, act) => {
  await act(page);
  await page.waitForTimeout(600); // longer than the drawer's slide
  await settled(page);
  return readState(page);
};
const CLOSED_ON_BUTTON = (lang) => ({ open: false, focus: 'menu button', path: `/${lang}/home` });

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-08 A2: on /${lang}/home, Escape closes the menu and focus returns to the menu button`, async () => {
    const state = await withMenu(`/${lang}/home`, (page) =>
      stateAfter(page, (p) => p.keyboard.press('Escape')),
    );
    assert.deepEqual(state, CLOSED_ON_BUTTON(lang));
  });

  test(`SHELL-08 A3: on /${lang}/home, the close button closes the menu and focus returns to the menu button`, async () => {
    const state = await withMenu(`/${lang}/home`, (page) =>
      stateAfter(page, (p) => p.click('mat-sidenav mat-toolbar button')),
    );
    assert.deepEqual(state, CLOSED_ON_BUTTON(lang));
  });

  test(`SHELL-08 A4: on /${lang}/home, a tap beside the menu closes it and focus returns to the menu button`, async () => {
    // The drawer is 280 px wide at the right edge, so x 40 is the page behind, under the backdrop.
    const state = await withMenu(`/${lang}/home`, (page) =>
      stateAfter(page, (p) => p.mouse.click(40, 400)),
    );
    assert.deepEqual(state, CLOSED_ON_BUTTON(lang));
  });
}
