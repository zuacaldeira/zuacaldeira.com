// Takes the build's content snapshot from the content API (D25).
const SECTIONS = [['home', 'hero']];
const LANGUAGES = ['en', 'de', 'pt'];

export async function fetchContent(api) {
  const snapshot = {};
  for (const [page, section] of SECTIONS) {
    for (const lang of LANGUAGES) {
      const response = await fetch(`${api}/api/content/${page}/${section}?lang=${lang}`);
      ((snapshot[page] ??= {})[section] ??= {})[lang] = await response.json();
    }
  }
  return snapshot;
}
