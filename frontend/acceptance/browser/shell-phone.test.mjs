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

// SHELL-08: the phone's menu. Opens /l/home at 390 px after Angular has started, with the menu
// closed; `fn` then reads or acts on the page.
const withPhone = async (route, fn) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('app-zc-nav-mobile header', { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    return await fn(page);
  } finally {
    await page.close();
  }
};

// Taps the menu button and waits until the menu is open in G's sense: the slide has ended and
// Material has moved focus into the drawer (a tick after the slide), so it has noted the menu
// button to give focus back to.
const openMenu = async (page) => {
  await page.click('app-zc-nav-mobile header button.menu-button');
  await page.waitForSelector('mat-sidenav.mat-drawer-opened');
  await settled(page);
  await page.waitForFunction(() =>
    document.querySelector('mat-sidenav').contains(document.activeElement),
  );
};

const withMenu = (route, fn) =>
  withPhone(route, async (page) => {
    await openMenu(page);
    return fn(page);
  });

// Until the drawer's slide has ended. Material marks it with mat-drawer-animating from the moment
// it opens or closes; the transition itself may not have started yet, so the class is the signal.
const settled = (page) =>
  page.waitForFunction(() => {
    const drawer = document.querySelector('mat-sidenav');
    return (
      !drawer.classList.contains('mat-drawer-animating') && drawer.getAnimations().length === 0
    );
  });

// The menu as a visitor reads it: the dialog's name and box, the nav's name, and each link's
// label as a screen reader reads it (without its icon and Contact's ⊥, SHELL-05b), href and height.
const readMenu = (page) =>
  page.evaluate(() => {
    const drawer = document.querySelector('mat-sidenav');
    const box = drawer.getBoundingClientRect();
    const label = (a) => {
      const copy = a.cloneNode(true);
      copy.querySelectorAll('mat-icon, [aria-hidden="true"]').forEach((el) => el.remove());
      return copy.textContent.replace(/\s+/g, ' ').trim();
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
  en: { name: 'Menu', nav: 'Main', labels: ['Software', 'Research', 'Writing', 'About', 'Contact'] },
  de: {
    name: 'Menü',
    nav: 'Hauptnavigation',
    labels: ['Software', 'Forschung', 'Texte', 'Über mich', 'Kontakt'],
  },
  pt: {
    name: 'Menu',
    nav: 'Navegação principal',
    labels: ['Software', 'Investigação', 'Textos', 'Sobre', 'Contacto'],
  },
};
// SHELL-11 and D16 in writing.md: the desktop menu's four pages, then Contact.
const PAGES = ['software', 'research', 'writing', 'about', 'contact'];

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

// Each menu link as "text | name": what shows (without its icon) and what a screen reader reads
// (without the parts hidden from it).
const readMenuWords = (page) =>
  page.evaluate(() => {
    const words = (a, hidden) => {
      const copy = a.cloneNode(true);
      copy.querySelectorAll(hidden).forEach((el) => el.remove());
      return copy.textContent.replace(/\s+/g, ' ').trim();
    };
    return [...document.querySelectorAll('mat-sidenav nav a')].map(
      (a) => `${words(a, 'mat-icon')} | ${words(a, 'mat-icon, [aria-hidden="true"]')}`,
    );
  });

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-05b: on a phone, /${lang}/home's menu shows ⊥ before Contact only, and no screen reader reads it`, async () => {
    const labels = MENU[lang].labels;
    assert.deepEqual(
      await withMenu(`/${lang}/home`, readMenuWords),
      labels.map((l, i) => `${i === labels.length - 1 ? '⊥ ' : ''}${l} | ${l}`),
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

  test(`SHELL-08 A5: on /${lang}/home, following About in the menu reaches /${lang}/about with the menu closed`, async () => {
    // Where focus goes after a link is SHELL-12's (D9), in shell-keyboard.test.mjs.
    const { open, path } = await withMenu(`/${lang}/home`, (page) =>
      stateAfter(page, (p) => p.click(`mat-sidenav nav a[href="/${lang}/about"]`)),
    );
    assert.deepEqual({ open, path }, { open: false, path: `/${lang}/about` });
  });

  test(`SHELL-08-P-01: on /${lang}/home with the menu closed, Escape changes nothing`, async () => {
    const [before, after] = await withPhone(`/${lang}/home`, async (page) => {
      await page.focus('app-zc-nav-mobile header a.logo');
      const before = await readState(page);
      return [before, await stateAfter(page, (p) => p.keyboard.press('Escape'))];
    });
    assert.deepEqual(after, before);
    assert.equal(before.open, false);
  });

  test(`SHELL-08-P-02: on /${lang}/home with the menu closed, Tab never reaches the menu's links`, async () => {
    // From the menu button to the end of the document: at the end (position="end") Material puts
    // the drawer after the content, so its links would come last, after the footer.
    const { visited, state } = await withPhone(`/${lang}/home`, async (page) => {
      await page.focus('app-zc-nav-mobile header button.menu-button');
      const visited = [];
      for (let i = 0; i < 150; i++) {
        await page.keyboard.press('Tab');
        const { focus } = await readState(page);
        if (focus === 'body') break; // focus has left the document
        visited.push(focus);
      }
      return { visited, state: await readState(page) };
    });
    assert.equal(state.focus, 'body', `did not reach the end: ${JSON.stringify(visited)}`);
    assert.deepEqual(
      {
        inMenu: visited.filter((f) => f.startsWith('in menu')),
        open: state.open,
        path: state.path,
      },
      { inMenu: [], open: false, path: `/${lang}/home` },
    );
  });

  test(`SHELL-08-P-03: on /${lang}/home with the menu open, Tab and Shift+Tab never leave it`, async () => {
    // Six controls in the menu (close and five links): ten presses each way wrap around.
    const { visited, state } = await withMenu(`/${lang}/home`, async (page) => {
      const visited = [];
      for (const key of [...Array(10).fill('Tab'), ...Array(10).fill('Shift+Tab')]) {
        await page.keyboard.press(key);
        visited.push((await readState(page)).focus);
      }
      return { visited, state: await readState(page) };
    });
    assert.deepEqual(
      {
        outside: visited.filter((f) => !f.startsWith('in menu')),
        open: state.open,
        path: state.path,
      },
      { outside: [], open: true, path: `/${lang}/home` },
    );
  });

  test(`SHELL-08-P-04: on /${lang}/home, a quick double tap on the menu button leaves the menu open`, async () => {
    // Read after a fixed wait, not `settled`: a menu opened and closed mid-slide stays marked
    // mat-drawer-animating, so waiting for the slide to end would never return.
    const { open, path } = await withPhone(`/${lang}/home`, async (page) => {
      await page.dblclick('app-zc-nav-mobile header button.menu-button');
      await page.waitForTimeout(1500);
      return readState(page);
    });
    assert.deepEqual({ open, path }, { open: true, path: `/${lang}/home` });
  });
}
