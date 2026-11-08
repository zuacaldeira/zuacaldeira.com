// What a built page downloads at once, for SW-PAGE-14 and WR-PAGE-10 (D20 in software.md).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const browser = join(import.meta.dirname, '../dist/zuacaldeira-com/browser');

// The scripts a page loads at once: its <script src> and modulepreload files, and every file they
// import statically, followed through (`import("…")` is loaded later, so it is left out).
export const loadedAtOnce = (route) => {
  const html = readFileSync(join(browser, route, 'index.html'), 'utf8');
  const queue = [...html.matchAll(/<script src="([^"]+\.js)"|<link rel="modulepreload" href="([^"]+\.js)"/g)].map(
    ([, src, href]) => src ?? href,
  );
  const seen = new Set();
  while (queue.length) {
    const file = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    const code = readFileSync(join(browser, file), 'utf8');
    for (const [, imported] of code.matchAll(/(?:from|import)\s*"\.\/([^"]+\.js)"/g)) queue.push(imported);
  }
  return [...seen];
};

/** The files a page loads at once that hold this sentence (ASCII only: the minifier escapes `·`). */
export const holding = (route, sentence) =>
  loadedAtOnce(route).filter((file) => readFileSync(join(browser, file), 'utf8').includes(sentence));
