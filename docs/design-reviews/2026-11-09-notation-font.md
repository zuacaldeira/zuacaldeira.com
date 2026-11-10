# Notation fonts beside Fraunces, Archivo and Plex Mono (2026-11-09)

**Approved by Zua on 2026-11-10 as it is**, the subscripts, `↠` and `→` included.

Review mode, before the build. The decision is "Notation fonts" in `docs/design.md`.
The screenshots are in `2026-11-09-notation-font/`, named `<where>-<light|dark>-<before|after>.png`.
They were taken in Chromium at 1280 px, 2× scale, on the build of `43376ca`. "After" injects the
notation fonts (Noto Sans Math, then STIX Two Text, `&text=` the 12 symbols) behind each token's main family.

| Shot | Text style | Before: symbols drawn by | After: drawn by |
|---|---|---|---|
| `research-statements` | Fraunces, band size and running size | Tinos, Noto Sans Math (system) | Noto Sans Math; `₁ ₂` STIX Two Text |
| `software-theorem-band` | Fraunces, band size | Tinos (system) | Noto Sans Math |
| `home-eyebrow-arrows` | Plex Mono, `→` | DejaVu Sans Mono (system) | Noto Sans Math |
| `research-researchgate-arrow` | Archivo link, `↗` | Noto Sans Math (system) | Noto Sans Math (loaded) |
| `footer-parallel` | Plex Mono, `∥` | Noto Sans Math (system) | Noto Sans Math (loaded) |

What changes, seen at 2×:
- `ℒ ≡ ≅ ≤ ⊤ ⊥` barely change on this machine, because its system fallback was Noto Sans Math
  already. On a Mac or Windows they changed more; now they look the same everywhere.
- `₁ ₂` (STIX Two Text) are a little larger and sit a little lower than Tinos's were. They read as
  serif digits beside Fraunces.
- `↠` (Noto Sans Math) is longer and heavier than Tinos's.
- `→` in the hero eyebrow is longer and thinner than DejaVu's, closer to the weight of Plex Mono.
