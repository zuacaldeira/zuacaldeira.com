// Acceptance test for the fonts that draw the site's text, in a real browser (SHELL-13, D38 to D42 in
// docs/examples/shell.md): Chromium is asked, through CDP, which fonts drew each text in the header,
// <main> and the footer. Run `npm run build` first, then `npm run acceptance:browser`. CHROMIUM_PATH
// picks a Chromium of your own, as in shell-phone.test.mjs. The fonts come from Google Fonts, so the
// test needs the network.
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

// The site's families (D38), and the two that may draw only notation symbols.
const SITE = [
  'Fraunces',
  'Archivo',
  'IBM Plex Mono',
  'Material Icons',
  'Noto Sans Math',
  'STIX Two Text',
];
const NOTATION = ['Noto Sans Math', 'STIX Two Text'];
// N, the symbols `src/index.html` loads the notation fonts for (D41).
const N = new Set(
  [
    ...readFileSync(join(import.meta.dirname, '../../src/index.html'), 'utf8').matchAll(
      /href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]*)"/g,
    ),
  ]
    .map(([, href]) => new URL(href.replaceAll('&amp;', '&')))
    .find((url) => url.searchParams.getAll('family').includes('Noto Sans Math'))
    ?.searchParams.get('text') ?? '',
);

const ROUTES = [
  ...['en', 'de', 'pt'].flatMap((lang) =>
    ['home', 'about', 'software', 'research', 'writing', 'running', 'contact'].map(
      (name) => `/${lang}/${name}`,
    ),
  ),
  '/',
  '/404',
];

// Each element's text with its descendants' (Chromium reports an element's fonts with its children's).
const texts = (node, into = new Map()) => {
  let text = node.nodeType === 3 ? node.nodeValue : '';
  for (const c of [...(node.children ?? []), ...(node.shadowRoots ?? [])]) {
    texts(c, into);
    text += into.get(c.nodeId);
  }
  into.set(node.nodeId, text);
  return into;
};
// Chromium names a face with its weight ("Archivo SemiBold"): its family is the start of the name.
const familyOf = (name) => SITE.find((f) => name === f || name.startsWith(`${f} `));

// The fonts that drew the header, <main> and the footer, as two lists of findings: a font outside the
// site's families (or a system font of the same name), and a notation font on a text with no symbol.
const fontFindings = async (page) => {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const own = texts(root);
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
      nodeId: root.nodeId,
      selector: 'header, header *, main, main *, footer, footer *',
    });
    const foreign = [];
    const lettersInNotation = [];
    for (const nodeId of nodeIds) {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      const text = (own.get(nodeId) ?? '').replace(/\s+/g, ' ').trim().slice(0, 50);
      for (const { familyName, isCustomFont } of fonts) {
        const family = familyOf(familyName);
        if (!isCustomFont || !family) {
          foreign.push(`${familyName}${isCustomFont ? '' : ' (system)'}: ${text}`);
        } else if (
          NOTATION.includes(family) &&
          ![...(own.get(nodeId) ?? '')].some((c) => N.has(c))
        ) {
          lettersInNotation.push(`${familyName}: ${text}`);
        }
      }
    }
    return { foreign: [...new Set(foreign)], lettersInNotation: [...new Set(lettersInNotation)] };
  } finally {
    await cdp.detach();
  }
};

for (const route of ROUTES) {
  test(`SHELL-13, 13-P-01: on ${route} (1280, light) every text in the header, main and footer is drawn by the site's fonts, symbols alone by the notation fonts`, async () => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: 'light',
    });
    try {
      const page = await context.newPage();
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelectorAll('[ngh]').length === 0, null, {
        timeout: 15000,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.fonts].every((f) => f.status !== 'loading'));
      // A face that failed to load (Google Fonts out of reach) is named first: it explains the rest.
      const failedFaces = await page.evaluate(() =>
        [...document.fonts]
          .filter((f) => f.status === 'error')
          .map((f) => `${f.family} ${f.weight}`),
      );
      assert.deepEqual(
        { failedFaces, ...(await fontFindings(page)) },
        { failedFaces: [], foreign: [], lettersInNotation: [] },
      );
    } finally {
      await context.close();
    }
  });
}
