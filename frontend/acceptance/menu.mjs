// The main menu of a built page (the desktop bar, as prerendered), for SW-PAGE-07 and the Writing
// page's WR-PAGE-06, 07 (D17 in writing.md): each link as "label → href", with " (current)" when it
// carries aria-current="page".
const label = (inner) =>
  inner
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const menu = (html) =>
  [...(html.match(/<div\b[^>]*class="desktop-menu-items"[^>]*>(.*?)<\/div>/s)?.[1] ?? '').matchAll(
    /<a\b([^>]*)>(.*?)<\/a>/gs,
  )].map(([, attrs, inner]) => {
    const href = attrs.match(/\shref="([^"]*)"/)?.[1];
    const current = /\saria-current="page"/.test(attrs) ? ' (current)' : '';
    return `${label(inner)} → ${href}${current}`;
  });
