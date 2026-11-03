// Takes the build's content snapshot from the content API (D25).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SECTIONS = [['home', 'hero']];
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

// npm run content: CONTENT_API (the build's backend, compose.build.yml) into the snapshot.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const api = process.env.CONTENT_API ?? 'http://127.0.0.1:8081';
  const out = new URL('../src/app/content/content.generated.json', import.meta.url);
  try {
    writeFileSync(out, JSON.stringify(await fetchContent(api), null, 2) + '\n');
    console.log(`Content snapshot from ${api} written to ${fileURLToPath(out)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
