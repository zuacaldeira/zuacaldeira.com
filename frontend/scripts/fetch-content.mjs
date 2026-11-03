// Takes the build's content snapshot from the content API (D25).
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
