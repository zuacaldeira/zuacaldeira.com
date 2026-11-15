# Build spec: the logo (option A, Losango)

Chosen on 2026-11-15: **option A, Losango, the lattice diamond.** Options B to F are not taken and
stay on the mock-up page for comparison. Visual reference: `index.html` beside this file, section
"Option A" (`#a`), and its evidence screenshots in `evidence/`. Mock-ups are not production code:
do not copy their markup. The behaviour is in `docs/examples/logo.md`, built test-first.

## Purpose
Replace today's two letters `zc` in the header and Angular's default shield in the browser tab with
one mark, and give a shared link a card. The mock-up describes the mark as the 2×2 Hasse diagram,
which is also the azulejo lozenge: ⊤ in ochre is the name, the join; ⊥ is open, where a protocol
starts. It is the lattice of two, not the hero's three strands. The same mark is already in the four
agreed page mock-ups (`docs/mockups/home/home.html` and the others, `.brand`).

## Today (measured 2026-11-12, `evidence/`)
- **Header:** the text `zc` in Fraunces 600 in a link `a.logo` with `aria-label="Home"`, in
  `zc-nav-desktop.html` and `zc-nav-mobile.html` (`<span class="logo-text">zc</span>`).
- **Tab:** `frontend/public/favicon.ico` is Angular's default red shield (md5
  `05bcfe9a02b93e1c5a5da14bfda8c41f`), linked in `frontend/src/index.html` as
  `<link rel="icon" type="image/x-icon" href="favicon.ico">`.
- **Shared link:** no `og:image`. `index.html` has `og:title` "Alexandre Caldeira", `og:description`
  "Researcher. Developer. Educator. Runner.", `og:type`, `og:url`; one set for every page.
- **Home-screen icon:** none.

## The mark

### Large drawing (header, home-screen icon, card): `viewBox="0 0 48 48"`
| Part | Geometry | Paint |
|------|----------|-------|
| 4 edges | lines (24,7)–(8,24), (24,7)–(40,24), (8,24)–(24,41), (40,24)–(24,41) | stroke `--zc-azul`, width 3, `stroke-linecap: round` |
| ⊤ (top) | circle (24,7), r 5.5 | fill ochre (D1) |
| 2 atoms | circles (8,24) and (40,24), r 4.5 | fill `--zc-azul` |
| ⊥ (bottom), open | circle (24,41), r 4.5 | fill `--zc-bg-warm`, stroke `--zc-azul`, width 3 |

Drawn in that order (edges first, so the dots sit on them). The SVG is decorative inside the link:
`aria-hidden="true"`, `focusable="false"`; the link carries the name (D5).

### Small drawing (16 and 32 px icons): `viewBox="0 0 16 16"`
| Part | Geometry | Paint |
|------|----------|-------|
| diamond | path `M8 2.6 2.6 8 8 13.4 13.4 8Z`, no fill | stroke cobalt, width 1.9, round caps |
| ⊤ | circle (8,2.6), r 2.3 | fill ochre |
| 2 atoms | circles (2.6,8) and (13.4,8), r 1.7 | fill cobalt |

At this size ⊥ is the diamond's bottom corner, with no ring of its own (as in the mock-up).

### Colours
| | Light glaze (`:root`) | Night glaze (`html.dark-theme`) |
|--|--|--|
| edges, atoms, ⊥ ring: `--zc-azul` | `#14417a` | `#7fa5ce` |
| ⊤: `--zc-ochre` as drawn (D1 recommends `--zc-ochre-text`) | `#b07a22` (`#8a5e15`) | `#d9a94a` (the same token value) |
| ⊥ fill: `--zc-bg-warm` | `#e9eff4` | `#0b1526` |

In the header the mark takes the page's tokens, so it follows whichever glaze is shown. The icon
files and the card are images and cannot: they use fixed values, named below.

Contrast, computed from the token values against the header's background (`color-mix(in srgb,
var(--zc-bg-warm) 84%, var(--zc-azul) 5%)` over the glaze: `#dee6ee` light, `#111c2e` night):

| | Light | Night | Needed |
|--|--|--|--|
| cobalt (edges, atoms, ⊥) | 8.06 | 6.65 | 3:1 |
| ⊤ in `--zc-ochre` | **2.95** | 7.91 | 3:1 |
| ⊤ in `--zc-ochre-text` | 4.51 | 7.91 | 3:1 |
| the name in `--zc-text-heading` | 14.49 | 14.74 | 4.5:1 |

The ochre as drawn falls just under the 3:1 that `docs/design.md` asks of ochre graphics, in the
light header only: D1.

## Header
The existing headers, `zc-nav-desktop` and `zc-nav-mobile`; the `a.logo` link stays (SHELL-04 reads
it) and keeps leading to the page language's home (`link('home')`).

| Width | What the link shows | Sizes |
|-------|---------------------|-------|
| 1280, 1440 (desktop bar) | mark and name | mark 32 × 32 px, gap 10 px, name "Zua Caldeira" in `--zc-font-heading` 600 at 1.25rem, `white-space: nowrap`, colour `--nav-fg` |
| 768 (desktop bar, below 980 px) | mark only | the name gives way to the mark below 980 px (`home-spec.md`, `shell.md`'s widths table) |
| 390 (`Handset`, phone bar) | mark only | mark 32 × 32 px; SHELL-06 holds: the name is not in the phone bar |

The link is at least 44 × 44 px at every width (`min-width`, `min-height`, as the mock-up's
`.brand`). The name is a name: not translated, `translate="no"`, the same on every page. Today's
`.logo-text` rules (`zc-nav-desktop.css`, `zc-nav-mobile.css`) are replaced. The global
`.logo { text-decoration: none }` in `styles.css` stays.

One component draws the mark for both bars (proposed `common/logo-mark/`, `LogoMark`: the large
drawing, inline SVG, its colours from the tokens), so the drawing is written once.

## Browser tab and home screen
Fixed colours, the light glaze's: cobalt `#14417a`, ochre `#b07a22` (or `#8a5e15`, D1), glaze
`#e9eff4`. The mock-up draws the icon with no ground on a light tab, and on its glaze tile on a dark
tab (32 px: a 32 × 32 square, corner radius 6, the small drawing at 24 × 24, inset 4). The ground is
D2.

| File (in `frontend/public/`) | What | Linked in `index.html` |
|------|------|------|
| `favicon.ico` (replaced) | the small drawing at 16 and 32 px, the large one at 48 px | `<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">` (the fallback) |
| `favicon.svg` (new) | the small drawing, `viewBox="0 0 16 16"` | `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` |
| `apple-touch-icon.png` (new) | 180 × 180, opaque: glaze square, the large drawing at 44/60 of the side (132 px), inset 8/60 (24 px). The device rounds the corners | `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` |

Measured against the mock-up's stand-ins for a browser's tab strip (`#dee1e6` light, `#202124` dark):
cobalt 7.75 on the light strip, 1.58 on the dark one; ochre 2.83 and 4.33; the glaze tile against the
dark strip 13.89, and on the tile cobalt 8.77, ochre 3.21.

Not in this work: a web app manifest and Android icons (the mock-up does not draw them).

## Shared-link card
One PNG, 1200 × 630, in `frontend/public/` (proposed `og-card.png`). The mock-up draws it at half
size (600 × 315); the values here are doubled to full size. It is the same card in the light and the
night glaze of the mock-up page: the mock-up draws no light-ground card (D3).

| Part | Value |
|------|-------|
| ground | `#0a2a55` (the light glaze's `--zc-azul-deep`), with two grids of 2 px lines at 45° and −45°, every 80 px, `rgba(247, 250, 252, 0.07)` |
| layout | the mark at 240 × 240 px on the left, then the text; gap 56 px, side padding 80 px, centred vertically |
| mark | the large drawing in the night glaze's colours: cobalt `#7fa5ce`, ochre `#d9a94a`, ⊥ fill `#0a2a55` (the ground) |
| name | "Zua Caldeira", Fraunces 600, 64 px, line height 1.05, `#f7fafc` |
| sentence | "I build software, and prove its protocols hold." (the hero's), Archivo 400, 32 px, line height 1.4, `#f7fafc` at 92 % opacity, 20 px below the name |
| address | "zuacaldeira.com", IBM Plex Mono 400, 25.6 px, `#d9a94a`, 28 px below the sentence |

Contrast on the ground: text 13.58, address 6.59, mark cobalt 5.54, ochre 6.59.

`index.html` gains `og:image` (absolute: `https://zuacaldeira.com/og-card.png`),
`og:image:width` 1200, `og:image:height` 630 and `og:image:alt` (D3's wording). The card is in
English for every page (D4).

## How the image files are made (D6)
`favicon.ico`, `favicon.svg`, `apple-touch-icon.png` and the card come from one source: the two
drawings and the card as SVG/HTML in a script folder (proposed `frontend/scripts/brand/`), drawn to
PNG and ICO by a script, as `lattice-wall/render.py` makes the hero wall. The files are never edited
by hand.

## Files each part touches
| Part | Files |
|------|-------|
| Header | new `src/app/common/logo-mark/` (component, spec); `common/navigation/zc-nav-desktop/zc-nav-desktop.html`, `.css`, `.spec.ts`; `common/navigation/zc-nav-mobile/zc-nav-mobile.html`, `.css`, `.spec.ts`; `acceptance/shell.test.mjs` or a new `acceptance/logo.test.mjs`; `acceptance/browser/header-type.test.mjs` (SHELL-13c: the name, not "zc", in Fraunces 600); a new browser test for colour, contrast and size; `docs/examples/shell.md` (SHELL-13c's wording, D8's leftover) |
| Tab and home screen | `public/favicon.ico` (replaced), `public/favicon.svg`, `public/apple-touch-icon.png` (new); `src/index.html` (the icon links); the script folder (D6); an acceptance test on the built files |
| Card | `public/og-card.png` (new); `src/index.html` (`og:image*`); the same script; an acceptance test on the built pages |

## States
- **Glazes:** the header mark follows the glaze (tokens); checked in light and night, the other
  three living glazes in the review after the build.
- **No JavaScript:** the mark is prerendered SVG; nothing to load.
- **Focus:** the link's focus ring, as today's `a.logo`; it holds the mark (and the name on desktop).
- **Languages:** nothing to translate in the mark, the name or the card; the link's name is D5.
- **Hover:** none in the header (the mock-up's ⊤ grows only on its own presentation panel).
- **Reduced motion:** the header mark does not move. The mock-up's drawing-in belongs to the mock-up
  page, not to the build.

## Accessibility
The link at least 44 × 44 px; the mark `aria-hidden`; the link named (D5), with the visible "Zua
Caldeira" inside the name on desktop (WCAG 2.5.3); the name 14.49:1 and 14.74:1; the mark's graphics
at 3:1 or more once D1 is taken; no horizontal scroll at 390 px (SHELL-06).

## How the mock-up was checked
Screenshots of the mock-up page at 390 and 1280 px, read by eye; no horizontal scroll at either
width. Contrast computed from the token values above (WCAG 2.1 relative luminance). Not measured in a
browser on the built header: that is the review after the build (`docs/design.md`).
