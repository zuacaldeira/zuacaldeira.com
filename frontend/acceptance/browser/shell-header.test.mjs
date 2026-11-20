// Acceptance tests for the header as the mock-ups draw it, in a real browser (SHELL-14 to 17 in
// docs/examples/shell.md, D45 to D49): one 1200 px column for header, pages and footer, the menu at
// the right in its language's words, the contact button as a plain link.
// Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH as in shell-phone.
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

const HEIGHT = { 390: 844, 768: 1024, 1280: 900, 1440: 900 };

// Opens a page at a width (light), waits for Angular, the fonts and every transition, runs `read`.
const atWidth = async ({ route, width, dark = false }, read, arg) => {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT[width] ?? 900 } });
  try {
    await context.addInitScript((v) => localStorage.setItem('zc-theme', v), dark ? 'dark' : 'light');
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(width < 600 ? 'app-zc-nav-mobile header' : 'app-zc-nav-desktop header');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    return await page.evaluate(read, arg);
  } finally {
    await context.close();
  }
};

// home-spec.md: the column's left edge, 16 px at 390 (the Handset gutter), 24 at 768, 64 at
// 1280, 144 at 1440; its right edge the width less the same.
const EDGE = { 390: 16, 768: 24, 1280: 64, 1440: 144 };

// In the page: the left edges of the logo, the <h1> and the footer's content; the right edges of
// the bar's last control and of the footer's content.
const READ_EDGES = () => {
  const r = (el) => el.getBoundingClientRect();
  const header = document.querySelector('app-zc-nav-mobile header, app-zc-nav-desktop header');
  const controls = [...header.querySelectorAll('a, button')].filter((el) => r(el).width > 0);
  const col = document.querySelector('app-footer .foot__col');
  const pad = getComputedStyle(col);
  return {
    left: {
      logo: Math.round(r(header.querySelector('a.logo')).left),
      h1: Math.round(r(document.querySelector('main h1')).left),
      footer: Math.round(r(col).left + parseFloat(pad.paddingLeft)),
    },
    right: {
      bar: Math.round(Math.max(...controls.map((el) => r(el).right))),
      footer: Math.round(r(col).right - parseFloat(pad.paddingRight)),
    },
  };
};

// In the desktop bar: whether the controls stand in the mock-up's order (the name, the menu, EN DE
// PT, the contact button, the theme button) and how far the menu's last word ends before EN. The
// words are measured, not the links' boxes (the mock-up's links carry padding, ours none).
const READ_BAR = () => {
  const header = document.querySelector('app-zc-nav-desktop header');
  const box = (el) => el.getBoundingClientRect();
  const words = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect();
  };
  const links = [...header.querySelectorAll('.desktop-menu-items a')];
  const parts = [
    ['name', box(header.querySelector('.logo-name'))],
    ['menu', { left: words(links[0]).left, right: words(links.at(-1)).right }],
    ['languages', box(header.querySelector('app-language-links a'))],
    ['contact', box(header.querySelector('.nav-cta'))],
    ['theme', box(header.querySelector('app-theme-toggle button'))],
  ];
  const outOfOrder = parts
    .slice(1)
    .filter(([, b], i) => b.left < parts[i][1].right)
    .map(([name]) => name);
  return { outOfOrder, menuToLanguages: Math.round(parts[2][1].left - parts[1][1].right) };
};

for (const width of [1280, 1440]) {
  for (const lang of ['en', 'de', 'pt']) {
    test(`SHELL-15: at ${width} in ${lang}, the menu stands at the right, its last word 24 px before EN`, async () => {
      assert.deepEqual(await atWidth({ route: `/${lang}/software`, width }, READ_BAR), {
        outOfOrder: [],
        menuToLanguages: 24,
      });
    });
  }
}

// In the desktop bar: its visible controls, left to right; those off the first row, those
// overlapping the one before, and whether the page scrolls sideways.
const READ_ROW = () => {
  const header = document.querySelector('app-zc-nav-desktop header');
  const controls = [...header.querySelectorAll('a, button')]
    .map((el) => ({ text: el.textContent.trim(), r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && r.height > 0)
    .sort((a, b) => a.r.left - b.r.left);
  const middle = (r) => r.top + r.height / 2;
  return {
    offRow: controls.filter(({ r }) => Math.abs(middle(r) - middle(controls[0].r)) > 2).map((c) => c.text),
    overlapping: controls.slice(1).filter((c, i) => c.r.left < controls[i].r.right - 0.5).map((c) => c.text),
    // styles.css clips html and body sideways, so a bar too wide is cut off, not scrolled: check both.
    outside: controls.filter(({ r }) => r.left < 0 || r.right > window.innerWidth).map((c) => c.text),
    sideways: document.documentElement.scrollWidth > window.innerWidth,
  };
};

test('SHELL-15b: at 768 in German, the bar holds every control in one row, none overlapping', async () => {
  assert.deepEqual(await atWidth({ route: '/de/software', width: 768 }, READ_ROW), {
    offRow: [],
    overlapping: [],
    outside: [],
    sideways: false,
  });
});

// In the page: each menu word's text and its computed text-transform, the bar's (desktop) or the
// phone menu's (its titles), so what a screen reader and a copy read is what shows (D45).
const READ_TRANSFORMS = () =>
  [...document.querySelectorAll('.desktop-menu-items a, mat-sidenav nav [matListItemTitle]')].map(
    (el) => `${el.textContent.replace(/\s+/g, ' ').trim()}: ${getComputedStyle(el).textTransform}`,
  );

for (const [lang, words] of [
  ['en', ['software', 'research', 'writing', 'about']],
  ['de', ['Software', 'Forschung', 'Texte', 'Über mich']],
  ['pt', ['software', 'investigação', 'textos', 'sobre']],
]) {
  for (const width of [1280, 390]) {
    test(`SHELL-16 (D45, D46): at ${width} in ${lang}, the menu's words are its text, with no text-transform`, async () => {
      const read = await atWidth({ route: `/${lang}/software`, width }, READ_TRANSFORMS);
      assert.deepEqual(
        read.slice(0, 4),
        words.map((w) => `${w}: none`),
      );
    });
  }
}

// In the page: the contact button as drawn, beside the tokens it must take, resolved in the bar.
const READ_CTA = () => {
  const header = document.querySelector('app-zc-nav-desktop header');
  const cta = header.querySelector('.nav-cta');
  const resolve = (token) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${token})`;
    header.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const cs = getComputedStyle(cta);
  return {
    drawn: {
      material: cta.classList.contains('mat-mdc-button-base'),
      font: cs.fontFamily.split(',')[0].replace(/"/g, ''),
      size: cs.fontSize,
      corners: cs.borderTopLeftRadius,
      tall: cta.getBoundingClientRect().height >= 44,
      ground: cs.backgroundColor,
      label: cs.color,
    },
    tokens: {
      accent: resolve('--zc-accent'),
      onAccent: resolve('--zc-on-accent'),
      hover: resolve('--zc-accent-hover'),
    },
  };
};

// The same page, the pointer over the button, every transition done: its ground.
const hoveredGround = async ({ route, dark }) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  try {
    await context.addInitScript((v) => localStorage.setItem('zc-theme', v), dark ? 'dark' : 'light');
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.hover('app-zc-nav-desktop .nav-cta');
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    return await page.evaluate(
      () => getComputedStyle(document.querySelector('app-zc-nav-desktop .nav-cta')).backgroundColor,
    );
  } finally {
    await context.close();
  }
};

for (const lang of ['en', 'de', 'pt']) {
  for (const dark of [false, true]) {
    test(`SHELL-17 (D47): at 1280 in ${lang}, ${dark ? 'dark' : 'light'}, the contact button is the mock-up's plain link`, async () => {
      const route = `/${lang}/software`;
      const { drawn, tokens } = await atWidth({ route, width: 1280, dark }, READ_CTA);
      assert.deepEqual(
        { ...drawn, hovered: await hoveredGround({ route, dark }) },
        {
          material: false,
          font: 'IBM Plex Mono',
          size: '14px',
          corners: '2px',
          tall: true,
          ground: tokens.accent,
          label: tokens.onAccent,
          hovered: tokens.hover,
        },
      );
    });
  }
}

// In the page: the gap from ⊥ to the first letter of the words after it, and the width of one
// space in the same element's font (measured on a hidden copy of the link).
const READ_SIGN_GAP = (selector) => {
  const link = document.querySelector(selector);
  const sign = [...link.querySelectorAll('[aria-hidden="true"]')].find((el) => el.textContent === '⊥');
  const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  let word = null;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    // The words after the sign; not the sign, and not an icon's ligature text ("mail").
    if (!sign.contains(node) && !node.parentElement.closest('mat-icon') && /\S/.test(node.textContent)) {
      word = node;
      break;
    }
  }
  const first = document.createRange();
  const at = word.textContent.search(/\S/);
  first.setStart(word, at);
  first.setEnd(word, at + 1);
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
  probe.textContent = 'a a';
  sign.parentElement.append(probe);
  const one = document.createElement('span');
  one.style.cssText = probe.style.cssText;
  one.textContent = 'aa';
  sign.parentElement.append(one);
  const space = probe.getBoundingClientRect().width - one.getBoundingClientRect().width;
  probe.remove();
  one.remove();
  const tenth = (n) => Math.round(n * 10) / 10;
  return {
    gap: tenth(first.getBoundingClientRect().left - sign.getBoundingClientRect().right),
    space: tenth(space),
  };
};

// The phone menu's links are drawn only once the menu is open.
const phoneContactGap = async (route) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    await context.addInitScript(() => localStorage.setItem('zc-theme', 'light'));
    const page = await context.newPage();
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    await page.click('app-zc-nav-mobile .menu-button');
    await page.waitForSelector('mat-sidenav nav a[href$="/contact"]', { state: 'visible' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
    return await page.evaluate(READ_SIGN_GAP, 'mat-sidenav nav a[href$="/contact"]');
  } finally {
    await context.close();
  }
};

for (const lang of ['en', 'de', 'pt']) {
  test(`SHELL-17b: at 1280 in ${lang}, a space stands between ⊥ and the contact button's words`, async () => {
    const { gap, space } = await atWidth(
      { route: `/${lang}/software`, width: 1280 },
      READ_SIGN_GAP,
      'app-zc-nav-desktop .nav-cta',
    );
    assert.ok(space >= 8 && gap >= space - 1, `gap ${gap} px, one space ${space} px`);
  });

  test(`SHELL-17b: at 390 in ${lang}, a space stands between ⊥ and the phone menu's Contact`, async () => {
    const { gap, space } = await phoneContactGap(`/${lang}/software`);
    assert.ok(space >= 1 && gap >= space - 1, `gap ${gap} px, one space ${space} px`);
  });
}

for (const route of ['/en/software', '/de/writing', '/pt/research']) {
  for (const width of [390, 768, 1280, 1440]) {
    test(`SHELL-14 (D48): at ${width} on ${route}, header, heading and footer share the column's edges`, async () => {
      const e = EDGE[width];
      assert.deepEqual(await atWidth({ route, width }, READ_EDGES), {
        left: { logo: e, h1: e, footer: e },
        right: { bar: width - e, footer: width - e },
      });
    });
  }
}
