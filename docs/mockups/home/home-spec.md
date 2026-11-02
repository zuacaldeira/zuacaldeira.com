# Build spec: Home page (frame, hero, theorem band)

Chosen on 2026-11-02: frame **A**, hero **B**, band **C**. Visual reference: `index.html` and
`home.html` beside this file; open `home.html` alone or through `index.html`. Mock-ups are not
production code: do not copy their markup. The behaviour is in `docs/examples/home.md`,
`shell.md` and `theme.md`, built test-first.

## Purpose
Tell a hiring manager within the first screen who this is, what he builds and where the work
and the CV are. Give a researcher the theorem and the paper without hunting. Sources: the
Website v2 boards (https://claude.ai/artifact/V4BY3xCveYFdkCky8kFXXa, `WebHome`, `WebPhone`)
and the Living Glaze study (https://claude.ai/artifact/LGHSasJRc4DXdBmk95CGyD).

## Layout per width
One column for everything: `max-width: 1200px`, centred, gutter 24 px (16 px under the
`Handset` query). Header, hero text, band and footer all start on its left edge. Measured for
each of them: 16 px at 390, 24 at 768, 64 at 1280, 144 at 1440.

| Part | 390 | 768 | 1280, 1440 |
|------|-----|-----|-----------|
| Header | 56 px: mark, `EN DE PT`, theme, menu | 64 px: mark, four links, `EN DE PT`, contact, theme | 64 px: mark and name, four links, `EN DE PT`, contact, theme |
| Hero | One column: text, then the lattice at up to 342 px. Links stacked, full width (below 480 px) | One column, buttons in a row | Text beside a 440 px lattice, gap 48 px |
| Theorem band | One column, lattice at up to 240 px after the text | One column | Text 1.5fr, lattice 1fr (up to 340 px), gap 64 px |
| Unfolded statements | One column | One column | Three columns |
| Footer | One column | Two columns | Two columns, 1.4fr and 1fr |

The switch to one column for hero and band is at 900 px. The name in the header gives way to
the mark below 980 px and under `Handset`.

## Components
- **Header:** the existing sticky header (`zc-nav-desktop`, `zc-nav-mobile`), rebuilt. Plain
  links, not `mat-flat-button`. Background `color-mix(in srgb, var(--zc-bg-warm) 88%,
  transparent)` with a 12 px blur.
- **Phone menu:** the existing `mat-sidenav`, from the right, as in the mock-up's stand-in.
- **New, `LanguageLinks`:** three codes in IBM Plex Mono. Current: heading colour, weight 500,
  a 2 px ochre underline. Also renders the full names for the footer.
- **New, `ThemeButton`:** replaces `theme-toggle`. Three states, one 44 px button, a different
  icon per state.
- **New, `Lattice`:** the 2³ Hasse diagram as inline SVG with four links (below).
- **New, `Button`:** a plain `<a>`, 44 px or taller, radius 2 px, filled or outlined. Not
  Material, whose overrides do not take effect today.
- **Hero, theorem band, footer:** rebuilt as the mock-up shows them. Do not reuse the old hero,
  its photo, its `LatticeWall` or the old `paper-statements` layout.

## Lattice
`viewBox="-50 -10 400 290"`. Nodes and edges from the mock-up. Each linked label is two
`<text>` elements: a halo below in the background colour, `aria-hidden`, and the underlined
text on top, because a single stroked text breaks the underline. Each link holds a transparent
`<rect>` as its target. Measured at 390 px: 125×51, 79×51, 125×51 and 168×46; focus outlines
that rect. The figure is `role="group"` with a translated `aria-label`, not `role="img"`,
because it holds links.

## Tile pattern (hero B)
Two `repeating-linear-gradient`s on the hero, at 45° and −45°, `transparent 0 31px, var(--grout)
31px 32px`, with `--grout: color-mix(in oklab, var(--zc-edge) 28%, transparent)`.

## Theorem band colours
Set with the glaze, not by the theme class:

| Token | Light glazes | Dark glazes |
|-------|--------------|-------------|
| `--band-bg` | accent | raised surface |
| `--band-fg` | on-accent | heading |
| `--band-btn` | on-accent | accent |
| `--band-btn-fg` | accent | on-accent |

Dark glazes use the surface because the lifted accent makes a glaring slab on a dark page. The
⊤ node keeps its ochre fill with a `--band-fg` outline. Notation is IBM Plex Mono.

## Footer colours
`--foot-bg` is heading on light glazes and raised on dark ones; `--foot-fg` is background on
light glazes and heading on dark ones. `--foot-gold` is fixed at `#d9a94a`; the email button
has `#1a1205` text on it.

## Tokens
Existing `--zc-*`, and:
- **New:** `--zc-on-accent`, `--band-*`, `--foot-*`, `--grout`, as above.
- **Changed:** `--zc-max-width` from 1100 px to 1200 px. Check the other pages when it changes.
- **Fonts:** add Fraunces 400 (the band's statement) to the link in `src/index.html`.
- **Theme mapping, from the study's tokens:** bg → `--zc-bg-warm`; surface → `--zc-bg-white`;
  raised → `--zc-bg-light`; wash → `--zc-azul-wash`; border → `--zc-border-light`; heading,
  body, muted → `--zc-text-*`; accent → `--zc-azul`, `--zc-accent`; accentHover →
  `--zc-azul-deep`, `--zc-accent-hover`; onAccent → `--zc-on-accent`; ochre, ochreText, edge →
  `--zc-ochre`, `--zc-ochre-text`, `--zc-edge`.

## States
- **Any time of day:** five glazes and two crossings, from the engine.
- **Long text:** German is the longest. The sentence takes four lines on a phone.
- **Missing translation:** the build fails (D4).
- **Unfold:** closed by default, `+` and `−` as marker, the summary at least 44 px.
- **404:** D9's wording, in the same frame (SHELL-09).
- **No JavaScript:** Cobalto; `<details>` still opens.
- **Loading:** none. The page is prerendered and calls no API in the browser.

## Copy to add
Listed with their IDs in the examples files. Removed: `hero.location`, `hero.tagline`,
`hero.aboutCta`, `hero.contactCta` on home. Not translated: the notation line, the lattice's
labels, the paper title, the statements.

## Accessibility
Contrast measured in the mock-up in all five glazes: text at least 4.5:1. All header, hero and
band controls at least 44 px at 390 px. Links in running text underlined. No information by
colour alone: the current language is underlined as well. `prefers-reduced-motion`: THEME-08.

## How the mock-up was checked
108 runs of `home.html` at 390, 768, 1280 and 1440, in all three languages and with each frame
option; all five glazes for German on frame A. Measured: horizontal overflow, header overflow
and overlap, contrast of every text element, control sizes. Screenshots were read by eye. It
ran with the mock-up's own markup, so the built page needs its own review (`docs/design.md`).
