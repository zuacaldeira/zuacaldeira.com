// Takes the build's content snapshot from the content API (D25).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SECTIONS = [
  ['home', 'hero'],
  ['software', 'head'],
  ['software', 'lead'],
  ['software', 'work'],
  ['software', 'how'],
  ['software', 'proof'],
  // Text several pages read, written as shared.json (D30).
  ['shared', 'paper'],
];
const LANGUAGES = ['en', 'de', 'pt'];

export async function fetchContent(api) {
  const snapshot = {};
  for (const [page, section] of SECTIONS) {
    for (const lang of LANGUAGES) {
      const url = `${api}/api/content/${page}/${section}?lang=${lang}`;
      const response = await fetch(url).catch((cause) => {
        throw new Error(`The content API cannot be reached at ${url}`, { cause });
      });
      if (!response.ok) {
        throw new Error(
          `No content for page ${page}, section ${section}, language ${lang} (${response.status})`,
        );
      }
      ((snapshot[page] ??= {})[section] ??= {})[lang] = await response.json();
    }
  }
  return snapshot;
}

/** Writes the snapshot as one file per page, `<dir>/<page>.json` (D21). */
export function writeSnapshot(snapshot, dir) {
  mkdirSync(dir, { recursive: true });
  for (const [page, sections] of Object.entries(snapshot)) {
    writeFileSync(join(dir, `${page}.json`), JSON.stringify(sections, null, 2) + '\n');
  }
}

// npm run content: CONTENT_API (the build's backend, compose.build.yml) into the snapshot, one file
// per page, which `@page-content/<page>` names in tsconfig.app.json (D21).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const api = process.env.CONTENT_API ?? 'http://127.0.0.1:8081';
  const out = fileURLToPath(new URL('../src/app/content/generated', import.meta.url));
  try {
    writeSnapshot(await fetchContent(api), out);
    console.log(`Content snapshot from ${api} written to ${out}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
