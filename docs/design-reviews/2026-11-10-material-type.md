# Material's type in the site's families instead of Inter (2026-11-10)

Review mode, before the build; D43 in `docs/examples/shell.md`, "Material's type follows the site"
in `docs/design.md`. **Approved by Zua on 2026-11-10:** `after-mockup` for the header (the menu in
IBM Plex Mono, the "zc" mark in Fraunces written as weight 600), the rest as `after` (the PDF button
and the race card's date and chips in Archivo, the card's title in Fraunces). D44 in `shell.md`.

Screenshots in `2026-11-10-material-type/`, named `<where>-<light|dark>-<variant>.png`, Chromium at
1280 px, 2× scale.
- `before`: today's build (`508fdc5`), Material in Inter.
- `after`: a throwaway build with Material's typography on the site's tokens,
  `(plain-family: var(--zc-font-body), brand-family: var(--zc-font-heading))`, built outside the
  repo and reverted at once; nothing of it is committed.
- `after-mark600`: as `after`, the mark at weight 600.
- `after-mockup`: as `after`, the mark at 600 and the menu in IBM Plex Mono at 0.875 rem, as the
  agreed home mock-up (`docs/mockups/home/home.html`: `.menu` Plex Mono, `.brand span` Fraunces 600).

The symbols (`⊥`, `∥`, the statements) still fall back to system fonts in both builds: the font
tokens are the next step of SHELL-13, not this comparison.

| Place | Before (Chromium's faces) | After |
|---|---|---|
| `header-menu-and-mark`, `header-menu-de`: the menu | Inter Medium | **Fraunces** (Material sets the toolbar in its display family) |
| `header-mark-closeup`: "zc" | Inter, 700 | Fraunces, 700 asked, the 600 face drawn |
| `band-pdf-button`: "Read the paper (PDF)" (home) | Inter Medium | Archivo SemiBold |
| `running-race-card`: title | Inter | Fraunces (Material's card title is display) |
| `running-race-card`: date, chips | Inter Medium | Archivo |

The mark's weight: 700 and 600 look the same (`…-after` and `…-after-mark600`), because only
Fraunces 400, 500 and 600 are loaded and Chromium uses the 600 face without faking a bolder one.
Fraunces is a variable font: asking Google Fonts for 700 as well serves the same file (Latin 67 kB,
loaded already), so it costs no font bytes and no first paint, only about 1.3 kB more inlined CSS per
page. It would make the mark heavier than the mock-up's 600.
