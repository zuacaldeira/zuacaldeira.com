# Examples: Theme

Status: **agreed with Zua on 2026-11-15** (the cases, the five slices, D1 to D10; answers under
"Decisions"). THEME-01 to 11 were agreed on 2026-11-02; this rewrite makes the living glaze the
site's one colour reference (Zua, 2026-11-15, the first section of "Settled" in `docs/design.md`) and
adds the removal of the five sources of drift, B1 to B5. Slice 1 is built (2026-11-15, on the
preview since 2026-11-20); slice 2 is being built (below). Before slice 1, only THEME-10 for today's
two themes was built.

The site's colours follow the visitor's local time through five azulejo glazes. Design: the Living
Glaze study, https://claude.ai/artifact/LGHSasJRc4DXdBmk95CGyD, agreed unchanged on 2026-11-02. Its
engine is copied, identical, in all five agreed mock-ups (marked "The glaze engine"; the tables,
keyframes, guard, token map and state minutes compared on 2026-11-15). Unit tests inject the time;
none reads a real clock (`docs/tdd.md`).

**Changed from the 2026-11-02 version,** because the engine says otherwise:
- THEME-03 named 07:30 and 21:00, which are blends (Manganês into Cobalto, Manganês nocturno into
  Vidrado nocturno); the pure glazes are at 06:30, 19:00 and 20:00.
- THEME-07's dark is Vidrado nocturno as the guard leaves it: its edge is `#526c8c`, not the
  table's `#516b8b`, which is 2.96:1 on the dark surface (THEME-16).
- The "In plain words" table in three languages is now the column below, English only, as in the
  other example files. THEME-06's labels in de and pt stay in the case.

**Already there,** so not cases here: THEME-10 for light and dark (`acceptance/theme.test.mjs`,
`acceptance/browser/theme-paint.test.mjs`, `services/theme-rule.cases.json`); the contrast reader
(`acceptance/browser/contrast.mjs`); the hero's v2 cases (HOME-HERO-01 to 09 in
`docs/examples/home.md`). Each must stay green, or be changed here on purpose (THEME-05 changes the
rule table).

Sections, in build order:
1. **The glaze** (THEME-01 to 04, 12 to 15): the engine, with the time injected.
2. **The tokens and Material** (THEME-11, 16 to 19): B1, B2, B3; the tokens from the glaze.
3. **Living, light and dark** (THEME-05 to 10, 20 to 24): B4; the toggle, first paint, the tick.
4. **The old hero goes** (THEME-25 to 26): B5. The new hero is home.md's (HOME-HERO-01 to 09).
5. **In the browser, every glaze** (THEME-27 to 29): no fixed colour anywhere, contrast in all five.
6. **Refused paths** (THEME-P-01 to P-09).

## 1. The glaze

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-01 | At lunchtime the site wears its cobalt-blue glaze. | the time 12:30 | the glaze is computed | it is Cobalto, exactly as its table: background `#e9eff4`, surface `#f7fafc`, accent `#14417a`, edge `#6987ab`; nothing moved by the guard | unit (the engine, time injected) | yes (unit, slice 1) |
| THEME-02 | In the middle of the night the site wears its dark night glaze. | the time 02:00 | the glaze is computed | it is Vidrado nocturno: background `#0b1526`, accent `#7fa5ce`; edge `#526c8c`, the one token the guard moves | unit | yes (unit, slice 1) |
| THEME-03 | Morning, early evening and evening each have their own glaze. | the times 06:30, 19:00 and 20:00 | the glaze is computed | Manganês (background `#f0ebf2`, accent `#5b2f73`), Amarelo e verde (`#f2eedf`, `#2f5b3b`) and Manganês nocturno (`#160f1f`, `#c4a3dc`), each exactly as its table | unit | yes (unit, slice 1) |
| THEME-04 | At every minute of the day, text and drawings stay readable. | every minute from 00:00 to 23:59 | the glaze is computed and written as the hex values the page gets | heading, body, muted, accent, accent hover and ochre text at least 4.5:1, ochre and edge at least 3:1, each against both background and surface; on accent at least 4.5:1 against the accent; the footer's text and gold, and the band's text, at least 4.5:1 against their grounds (derived by mode, as the mock-ups' `paint()`; D5). Red with the study's engine: the fixed gold falls to 2.21:1 at 06:14 and 19:46 (12 minutes below), the footer text to the edge at 06:15 | unit, 1440 minutes, measured on the rounded hex values (D2) | yes (unit, 1440 minutes on the rounded hex, slice 1) |
| THEME-12 | Between night and morning, and evening and night, the ground fades and the ink switches once. | the minutes 06:00 to 06:30 and 19:30 to 20:00 | the glaze is computed | the background changes every minute; the inks are the dark side's up to 06:14 and the light side's from 06:15, the light side's up to 19:45 and the dark side's from 19:46; the mode changes at those two minutes and at no other minute of the day | unit | yes (unit, slice 1) |
| THEME-13 | A colour too faint for its ground is darkened or lightened until it is readable. | a glaze below its minimum: Vidrado nocturno's edge `#516b8b` (2.96:1 on its surface); and a test glaze whose muted is 2:1 on a light ground | the glaze is computed | the edge becomes `#526c8c` (3.00:1); the test muted moves toward black, only as far as 4.5:1; a token already above its minimum is left as its table has it (THEME-01) | unit (the night edge; a test table injected) | yes (unit, a test table, slice 1) |
| THEME-14 | Two glazes blend smoothly between their times. | the time 08:15, halfway from Manganês (06:30) to Cobalto (10:00) | the glaze is computed | each token is the Oklab midpoint of the two glazes' values (the study's smoothstep at t = ½; background `#ededf3`), before the guard; 06:30 and 10:00 give the pure glazes | unit | yes (unit, slice 1) |
| THEME-15 | The glaze's values are kept in one table, the same the mock-ups use. | the build's glaze table (D3) and the engine in `docs/mockups/home/home.html` | both are read | the five glazes, 14 tokens each, the keyframes and the minimums are equal | the scripts' test (`npm run test:scripts`) | yes (scripts' test, slice 1) |

## 2. The tokens and Material

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-16 | The site's colour tokens are the glaze's, not typed by hand. | `styles.css` | its colour blocks are read | the `:root` block equals the glaze at 12:30 and the `html.dark-theme` block the glaze at 02:00, token for token, through the mock-ups' map (`bg` → `--zc-bg-warm`, `surface` → `--zc-bg-white`, `accent` → `--zc-azul` and `--zc-accent`, …); no other colour token is declared except the footer's gold pair (D5). Red today: the dark `--zc-edge` is `#516b8b`; `--zc-azul-pale`, `--zc-accent-light`, `--zc-ochre-wash`, `--zc-tile` and `--zc-grout` are declared | the scripts' test (D4) | yes (scripts' test, slice 1) |
| THEME-11 | Buttons and other ready-made controls take the current glaze's colours, not a foreign teal. | a Material filled button and an icon button on a built page, in light, dark and living at 06:30, 19:00, 20:00 | they render | the filled button's background is the glaze's `--zc-accent` and its label `--zc-on-accent`; the icon button's glyph is its bar's ink. Red today: `#006a6a` in light, `#00dddd` in dark | browser | |
| THEME-17 | Material has no palette of its own any more. (B1) | the built stylesheet | its `--mat-sys-*` declarations are read | every `--mat-sys-*` colour is a `var(--zc-…)` or a mix of them (D9); no colour literal; `material-theme.scss` names no `$cyan-palette` or `$violet-palette`. Red today: the cyan and violet palettes, `--mat-sys-primary: #006a6a` | build and a source check | |
| THEME-18 | The page's ground is the glaze's ground, on a phone too. (B2) | `/en/software` at 390 (the phone layout inside the Material sidenav) and at 1280, light, dark and living at 20:00 | the ground behind `<main>` is measured | `body`, the sidenav container and the sidenav content are each `--zc-bg-warm` or transparent over it; `material-theme.scss`'s `body` no longer takes `--mat-sys-surface`. Expected red today at 390: the sidenav's ground is Material's (measure when the test is written) | browser, and a source check | |
| THEME-19 | No override is left that Material no longer reads. (B3) | the app's sources and the built CSS | they are searched | no `--mdc-` anywhere; the header's "write to me" button is `--zc-accent` with `--zc-on-accent` as in the home mock-up; the header's icon buttons draw in `--nav-fg`. Red today: eight `--mdc-` declarations in `zc-nav-desktop.css`, `zc-nav-mobile.css`, `hero.css`; the button is teal | source check, build and browser | |

## 3. Living, light and dark

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-05 | On a first visit, the colours follow the time of day where the visitor is. | nothing stored, or `living` stored; a device clock at 20:00 local (and 18:00 UTC) | the page loads | the state is living and the page wears Manganês nocturno, from the local hours, not UTC; the device's light or dark setting is not read (D1). Red today: the device setting decides, and only light or dark exist (B4) | unit (service, clock injected); build (the head script in a VM, as today's THEME-10); the rule table `theme-rule.cases.json` changes with it | |
| THEME-06 | The theme button cycles light, dark and living, says which is on, and remembers the choice. | the state is living, on `/de/home` | the theme button is pressed three times | the state goes light, dark, living; its accessible name names the state, in the page's language (en "Theme: light", "Theme: dark", "Theme: living glaze"; de "Farbschema: hell", "dunkel", "lebendige Glasur"; pt "Tema: claro", "escuro", "vidrado vivo"); the icon is the sun, the moon, the half lozenge of the mock-up; each choice is stored as `zc-theme`. Red today: two states, English names ("Switch to dark mode") | unit (component and service); browser (keyboard press, name read) | |
| THEME-07 | A visitor who chose light or dark keeps those colours, whatever the time. | `light` stored, or `dark` stored; the clock at 06:30, 12:30, 20:00, 02:00 | the page loads and an hour passes | light is the glaze at 12:30 (Cobalto) and dark the glaze at 02:00 (Vidrado nocturno, THEME-02) at every one of those times; nothing changes over the hour | unit; build (head script) | |
| THEME-08 | For a visitor who prefers less motion, the colours stay as they loaded until the page is opened again. | living, reduced motion asked, loaded at 19:40 | three hours pass, through the 19:46 switch | the tokens stay those of 19:40; no tick runs. Pressing the button still changes the state at once, without a transition | unit (fake timers) | |
| THEME-09 | The opening and the paper band appear in their chosen design at once. | the built `/de/home` | it is read | `<html>` carries `data-hero="b"` and `data-band="c"` in the prerendered HTML, before any script runs | build | |
| THEME-10 | The right colours are there from the first paint; without scripts the page is the blue glaze and readable. | the built `/en/software`, `/de/home`, `/`, `/404`; nothing stored and the clock at 02:00, 06:15, 12:30, 20:00; `light` and `dark` stored | the head's inline scripts run in a VM | before any other script, the glaze's colour tokens on `<html>` equal the glaze of THEME-05 or 07 for that case; without JavaScript the page shows the `:root` tokens, Cobalto | build (VM); browser with JavaScript off | for today's two themes (build, browser and unit, 2026-11-08, D25 in `software.md`); the living glaze's colours come with slice 3 |
| THEME-20 | The page is a dark page to the browser whenever the glaze is dark. | living at 20:00 and at 12:30; dark stored; light stored | the page loads | at 20:00 and with dark, `<html>` has `dark-theme` and `color-scheme: dark`; at 12:30 and with light, neither; in living the class changes at 06:15 and 19:46 with the inks (THEME-12, D7) | unit; build (VM) | |
| THEME-21 | While a living page stays open, its colours keep following the clock, gently. | living, no reduced motion, opened at 19:45 | one minute passes | the tokens are set again for 19:46 (the dark side); each colour token changes through a transition of about a second (D6), not at once | unit (fake timers); browser (the transition read from the computed style) | |
| THEME-22 | Leaving living stops the clock. | living, opened at 19:40 | the button is pressed (light), then an hour passes | the tokens are Cobalto and do not change; no tick remains; the same when the page's root is destroyed | unit (fake timers) | |
| THEME-23 | A stored value the site does not know counts as nothing stored. | `blue` stored; or the storage throws when read | the page loads at 20:00 | the state is living (Manganês nocturno); the page is painted; nothing is written until the button is pressed. Red today: `blue` follows the device setting | unit; build (head script, VM; the rule table's `blue` row changes) | |
| THEME-24 | The choice holds on every page and language. | `dark` stored on `/de/home` | `/pt/research` and `/404` are opened | both are dark from first paint, with the button named in their language | browser | |

### Diagram: first paint

```mermaid
flowchart TD
    H["Prerendered HTML<br/>data-hero, data-band, Cobalto tokens in :root"] --> S{"Inline script in head"}
    S -->|"nothing, living or unknown stored (THEME-05, 23)"| L["Living: the glaze for the local minute"]
    S -->|"light stored"| C["The glaze at 12:30, Cobalto"]
    S -->|"dark stored"| N["The glaze at 02:00, Vidrado nocturno"]
    S -.->|"no JavaScript"| C0["The :root tokens, Cobalto"]
    L --> P["First paint, dark-theme and color-scheme by the glaze's mode (THEME-20)"]
    C --> P
    N --> P
    P --> T{"Living and no reduced motion?"}
    T -->|"yes"| K["Every minute: set the 14 tokens again, with a short transition (THEME-21)"]
    T -->|"no"| Z["The colours stay until the next load (THEME-07, 08)"]
```

### Diagram: the toggle (THEME-06)

```mermaid
stateDiagram-v2
    [*] --> living: nothing stored (THEME-05)
    living --> light: press
    light --> dark: press
    dark --> living: press
```

### Diagram: the day (THEME-01 to 03, 12)

```mermaid
flowchart LR
    A["00:00 to 05:00<br/>Vidrado nocturno"] --> B["05:00 to 06:00<br/>into Manganês nocturno"]
    B --> X1["06:00 to 06:30 crossing<br/>inks switch at 06:15"]
    X1 --> C["06:30 Manganês<br/>into Cobalto"]
    C --> D["10:00 to 15:00<br/>Cobalto"]
    D --> E["15:00 to 18:00<br/>into Amarelo e verde"]
    E --> F["18:00 to 19:30<br/>Amarelo e verde"]
    F --> X2["19:30 to 20:00 crossing<br/>inks switch at 19:46"]
    X2 --> G["20:00 Manganês nocturno<br/>into Vidrado nocturno"]
    G --> A2["23:00 Vidrado nocturno"]
```

## 4. The old hero goes (B5)

The new hero (the sentence and the 2³ lattice on the lozenge tile, hero option B) is built by
HOME-HERO-01 to 09 in `docs/examples/home.md`, from `docs/mockups/home/home.html` and its spec.
These two cases say the old one is gone and leaves nothing behind.

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-25 | The old photo opening is gone from the home page. | the built `/`, `/en/home`, `/de/home`, `/pt/home` | the pages and the build's files are read | no `<picture>`, no `hero-placeholder` file or reference, no "Misty sunrise", no `app-lattice-wall`, no "74 distinct lattices" credit, no `hero__glass`; no file under `assets/hero/` in the build (D8). Red today: all of them | build | |
| THEME-26 | The site's own styles hold no fixed colour. | every `.css` under `src/app` and `src/styles.css` outside its generated blocks | they are searched for colour literals (hex, `rgb()`, `hsl()`, colour names) | none, apart from `transparent`, `currentColor` and the shadows' black (D5). Red today: 19, in `hero.css` (17), `zc-nav-desktop.css` (1) and `lattice-wall.css` (1) | source check (`npm run test:scripts`) | |

## 5. In the browser, every glaze

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-27 | Nothing on a page keeps its colour when the glaze changes. | `/en/home`, `/en/software`, `/en/research`, `/en/writing`, `/en/about`, `/404`, at 390 and 1280 | each is shown at 12:30 (Cobalto) and at 20:00 (Manganês nocturno), and the computed `color`, `background-color`, `border-color`, `fill`, `stroke` of every visible element are compared | every non-transparent colour differs between the two, except the footer's gold pair (D5). Red today (with light and dark in place of the two times): the hero's white and gold | browser | |
| THEME-28 | Pages stay readable in all five glazes, and at the worst minutes of the crossings. | `/en/home`, `/de/software`, `/de/about` at 1280 and 390 | shown at 06:30, 12:30, 19:00, 20:00, 02:00, 06:15 and 19:48 | every text in `<main>`, header and footer at least 4.5:1 against its ground, lattice edges and ochre marks at least 3:1 | browser, with the shared contrast reader | |
| THEME-29 | The glaze is the same on every page. | the same pages at 20:00 | the glaze's colour tokens on `<html>` are read | equal on every page, and equal to THEME-03's Manganês nocturno | browser | |

## 6. Refused paths

| ID | In plain words | Given | When | Then | How a test checks it | Covered |
|----|----------------|-------|------|------|----------------------|---------|
| THEME-P-01 | A guard that leaves a colour below its minimum is refused. | the engine with its guard taken out | the day is computed | THEME-04 goes red, naming the minute and the token (02:00, edge, 2.96:1) | break in the engine | yes (break in the engine, slice 1) |
| THEME-P-02 | Reduced motion never changes the glaze with time. | living, reduced motion, the tick forced to run | three hours pass | THEME-08 goes red if any token changes | break in the service | |
| THEME-P-03 | A fixed colour put back in a component is refused. | `hero.css` | `color: #ffffff` is put back | THEME-26 goes red, naming the file and line | break in the source | |
| THEME-P-04 | A dead `--mdc-` override put back is refused. | `zc-nav-desktop.css` | `--mdc-filled-button-container-color` is put back | THEME-19 goes red | break in the source | |
| THEME-P-05 | Material's own palette put back is refused. | `material-theme.scss` | `primary: mat.$cyan-palette` is put back | THEME-17 goes red, naming `--mat-sys-primary` | break in the build | |
| THEME-P-06 | A hand edit of a generated colour token is refused. | `styles.css` | the dark `--zc-edge` is set back to `#516b8b` | THEME-16 goes red, naming the token, the value and the glaze's `#526c8c` | break in the source | yes (break in the source, slice 1) |
| THEME-P-07 | A glaze table missing a token, or with a token not in the map, is refused. | the glaze table | Amarelo e verde's `edge` is removed, or a token `teal` is added | the table's check fails naming the glaze and the token; nothing is generated | the scripts' test | yes (scripts' test, the engine and the generator, slice 1) |
| THEME-P-08 | The study's rounding slip does not reach the site. | the minutes 19:48 and 19:52, where the study's engine, rounded to hex, gives body 4.455:1 and edge 2.969:1 | the glaze is computed | the hex values set pass 4.5:1 and 3:1 (D2) | unit (named minutes, inside THEME-04) | yes (unit, slice 1) |
| THEME-P-09 | The device's dark setting does not override living. | nothing stored, the device asking for dark, the clock at 12:30 | the page loads | Cobalto, not Vidrado nocturno (D1, recommended option) | unit; build (VM) | |

## Decisions

**Answered by Zua on 2026-11-15:**
- **The cases and the five slices as proposed:** (1) the glaze engine and tokens, `styles.css`'s
  colour lines generated from the glaze; (2) Material follows the glaze, B1 to B3; (3) living, light
  and dark, B4; (4) the new home hero, B5, its own element from `home.md`'s cases; (5) every glaze in
  the browser.
- **D1: living, as agreed (option 1).** On a first visit the device's dark setting is ignored;
  everyone gets the glaze of the time. One press of the toggle gives dark, and that choice is
  remembered.
- **D2 to D10 as recommended** (the first option of each): among them, contrast is checked after
  rounding to hex (D2), and the guard covers the footer's gold and text (D5).
- **The site is built to its design:** a built colour outside the glaze's tokens is drift.
- **Merging:** `next` goes into `main` only when the whole site is built.

Taken while planning slice 1 (2026-11-15, tdd-peer; Zua may change them):
- **D11. Where the parts live.** The table `src/app/services/glaze.json` and the engine
  `src/app/services/glaze.mjs`, beside `theme.service.ts` and `theme-rule.cases.json`, which use them
  in slice 3. The generator is `scripts/glaze-tokens.mjs`; the tests are `scripts/glaze.test.mjs`
  (the engine and the table) and `scripts/glaze-tokens.test.mjs` (`styles.css`), run by
  `npm run test:scripts` with `node --test`: the engine is plain JavaScript and needs no Angular.
- **D12. The engine's names are the study's:** `themeAt(table, minute)` returns `{ hex, mode, moved }`,
  `hex` keyed by the study's 14 names, plus the footer's and band's six (`footBg`, `footFg`,
  `footGold`, `footOnGold`, `bandBg`, `bandFg`), derived by mode as `paint()` does and guarded (D5).
  `checkTable(table)` refuses a bad table (THEME-P-07).
- **D13. The gold pair is in the table too** (`fixed`), and the generator writes it into the `:root`
  block with the 14, so every colour literal in `styles.css` is generated, apart from the shadows'
  black (D5).

The options as they were proposed (recommendation first):

- **D1. A device set to dark, on a first visit.** The study and the 2026-11-02 agreement make living
  the default; today's site follows the device's dark setting.
  1. *(recommended)* Living, as agreed: the device setting is not read. A visitor in a dark room at
     noon sees Cobalto and can press the button once for dark. THEME-05, P-09 as written.
  2. A device set to dark starts in dark, until the visitor presses the button. P-09 turns
     around; living is the default only for light devices.
  3. Living, but a dark device sees only the two nocturnal glazes. Not in the study: it needs a
     design round first.
- **D2. The guard is measured on the colours the page gets.** The study's engine checks before
  rounding to hex, so at 113 token-minutes of the crossings it leaves a value up to 0.05 below
  (body 4.455:1 at 19:48, edge 2.969:1 at 19:52; measured 2026-11-15).
  1. *(recommended)* The site's engine rounds, checks, and steps on until the rounded value passes.
     The study's rule, kept where it matters; the study itself stays as it is.
  2. Port the engine unchanged and accept the slips. WCAG's minimums have no tolerance.
- **D3. One engine, one table.** The head script must paint before Angular runs, and the service
  must tick after it.
  1. *(recommended)* A plain module `glaze.mjs` with no imports, and the table `glaze.json` (the
     study's values). A build step inlines the module into `index.html`'s head, as the content
     snapshot is written before the build; `ThemeService` imports the same module; the tests read
     the same table, as `theme-rule.cases.json` is read today.
  2. The engine only in `index.html`; the service reads what it left on `window`. Unit tests cannot
     import it.
  3. A precomputed table of 1440 minutes. About 100 KB in every page's head.
- **D4. The `styles.css` colour blocks are generated.**
  1. *(recommended)* A script writes the `:root` and `html.dark-theme` colour lines between two
     marker comments from `glaze.json`, and THEME-16 fails on a hand edit (as the lattice wall's
     `render.py` and its test today).
  2. Hand-written, with THEME-16 checking only. A wrong value is found, not prevented.
- **D5. Colours outside the 14.**
  1. *(recommended)* The footer's gold pair (`--zc-foot-gold` `#d9a94a`, `--zc-foot-on-gold`
     `#1a1205`) keeps its values but joins the guard: in the crossings the footer's ground is a
     blended grey, and the fixed gold falls to 2.21:1 (06:14, 19:46; 12 minutes under 4.5:1), so
     the guard pushes it toward white there, and the label on it against it. The footer's and
     band's text join the guard against their grounds too (THEME-04). The shadows' black stays. `--zc-azul-pale`, `--zc-accent-light`, `--zc-ochre-wash`, `--zc-tile`
     and `--zc-grout` go: their only users are the old hero and its wall; hero B's tile lines are
     `color-mix(in oklab, var(--zc-edge) 28%, transparent)` as in the mock-up. The footer's and
     band's grounds stay derived by mode, as the mock-up's `paint()` does.
  2. The gold fixed and unguarded, as the mock-ups have it: 12 minutes a day under 4.5:1.
  3. The gold follows the glaze's ochre. The footer's mail button would change colour by the
     hour, which the mock-ups never showed.
- **D6. The tick's transition.**
  1. *(recommended)* The 14 colour tokens are registered with `@property` (syntax `<color>`) and
     transition on `<html>` for 1 s, so every user of a token follows without a rule per element;
     none under reduced motion. The study's own duration replaces the 1 s if Zua prefers it.
  2. A transition on `background-color` and `color` of `body` only. Cards, borders and the lattice
     would jump.
- **D7. `dark-theme` follows the glaze's mode,** so the rules already written for
  `html.dark-theme` (the footer, the band, the shadows) apply in Manganês nocturno and Vidrado
  nocturno, and switch at 06:15 and 19:46 with the inks. Alternative: a new attribute for the mode,
  and every `html.dark-theme` rule rewritten. Recommended: the class.
- **D8. The old hero's parts are deleted,** not parked: the photo and its files, `hero__glass`, the
  lattice wall component, its generator (`scripts/lattice-wall/`, `render.py`,
  `scripts/lattice-wall.test.mjs`) and the lines naming them in `CLAUDE.md`. Git keeps them; D6 in
  `home.md` says how the wall would return. Alternative: keep the generator in `scripts/`, unused.
  Recommended: delete ("delete all other sources that are provoking the drift").
- **D9. Material's colours, mapped.** Recommended: `primary`, `secondary`, `tertiary` and
  `surface-tint` → `--zc-accent`; their `on-` roles → `--zc-on-accent`; their containers →
  `--zc-azul-wash`, on them `--zc-text-heading`; `background`, `surface`, `surface-bright`,
  `surface-dim` → `--zc-bg-warm`; `surface-container-lowest` and `-low` → `--zc-bg-white`;
  `surface-container`, `-high`, `-highest`, `surface-variant` → `--zc-bg-light`; `on-background`,
  `on-surface` → `--zc-text-body`; `on-surface-variant` → `--zc-text-muted`; `outline` →
  `--zc-edge`; `outline-variant` → `--zc-border-light`; `inverse-surface` → `--zc-text-heading`,
  `inverse-on-surface` → `--zc-bg-warm`, `inverse-primary` → `--zc-azul-wash`; `error` roles →
  `--zc-ochre-text` and `--zc-bg-light` (the site shows no error state today). How (for example
  `mat.theme-overrides`) is the build's choice; THEME-17 checks the result.
- **D10. The hero is its own element.** B5 is a page change, not a colour change: the new hero
  builds from HOME-HERO-01 to 09 with `home.md`'s slices; this file only adds THEME-25 and 26.
  Recommended. Alternative: the hero inside slice 2 here, which would make one slice of a
  colour fix and a new opening.

Agreed with the developer on 2026-11-02, still standing:

- **The living glaze as the study has it,** and **living is the default state.** Light and dark
  are manual overrides.
- **Hero and band are theme settings,** `{ hero: 'b', band: 'c' }`. Only these defaults are built;
  another value is added when it is first wanted, with its own cases. The frame is not a setting.
  A changed setting goes live with the next build.

Decided on 2026-11-08 (D25 in `docs/examples/software.md`):

- **THEME-10 was built first for today's two themes:** an inline script in `index.html`'s `<head>`
  applies the saved choice, else the device's setting, before first paint; `theme-rule.cases.json`
  holds the rule for the script and for `ThemeService`. The living glaze extends the same script
  and table (THEME-05, 23).

Not designed yet, and not in these cases:

- **Reacting to events** (a new post, a social event). The settings above are where it would
  attach.

## Slices (agreed 2026-11-15)

Each slice ends green and visible on the preview. Slice 2 comes before 3: living with Material's
teal still in place would show teal on violet and green grounds.

1. **The glaze and the tokens.** `glaze.json`, `glaze.mjs`, the generated colour blocks in
   `styles.css` (D3, D4, D5). Visible: only the night edge, one step lighter; the five hand-made
   tokens go once nothing uses them (with slice 4 for the hero's). Cases: THEME-01 to 04, 12 to
   16, P-01, P-06, P-07, P-08.
2. **Material follows the glaze (B1, B2, B3).** The palettes go, `--mat-sys-*` mapped (D9), the
   page ground, the `--mdc-` overrides go, the header button as the mock-up. Visible: no teal, the
   phone's ground. `docs/design.md`'s teal trap and `CLAUDE.md`'s "Material 3 theme" lines change
   with it. Cases: THEME-11, 17, 18, 19, P-04, P-05.
3. **Living, light and dark (B4).** The head script and `ThemeService` on the engine, the three
   states, the toggle's names and icons, the tick and its transition, `dark-theme` by mode, the
   rule table rewritten. Visible: the site follows the clock. Cases: THEME-05 to 08, 10, 20 to 24,
   P-02, P-09; THEME-09 stays green.
4. **The hero (B5), its own element** (D10): HOME-HERO-01 to 09 build the new hero; the old one
   goes with THEME-25, 26, P-03 (D8).
5. **Every glaze in the browser.** After 3 and 4: THEME-27 to 29, then the design review on the
   preview under all five glazes, at 390 and 1280, in en and de.

## Slice 1: the glaze and the tokens

What it builds: the study's table as `glaze.json`; the engine `glaze.mjs` (no imports, the table
passed in) with the study's blend, crossings and guard, the guard measured on the rounded hex (D2) and
extended to the footer and band (D5); and `scripts/glaze-tokens.mjs`, which writes `styles.css`'s two
colour blocks between marker comments from the engine at 12:30 and 02:00 (D4). Nothing at runtime
uses the engine yet (slice 3). Visible after the slice: only the night edge, `#516b8b` → `#526c8c`;
the five hand-made tokens leave `styles.css` (no user outside the old hero, which sets its own
`--zc-tile` and `--zc-ochre-wash` on `.hero__lattice` until slice 4).

Test list (crossed off in the "Done" note below as each is committed):
- **The table** (`scripts/glaze.test.mjs`):
  - T1 THEME-15, `glaze.json` equals the engine in `docs/mockups/home/home.html` (its glazes, 14
    tokens each, keyframes, minimums, the token map and the two states' minutes), read by running
    the mock-up's engine part in a VM.
  - T2 THEME-P-07, `checkTable` refuses Amarelo e verde without `edge`, and a glaze with `teal`,
    naming the glaze and the token.
- **The engine** (`scripts/glaze.test.mjs`, the minute injected):
  - E1 THEME-01, 12:30 is Cobalto exactly, nothing moved.
  - E2 THEME-03, 06:30, 19:00 and 20:00 are Manganês, Amarelo e verde, Manganês nocturno exactly.
  - E3 THEME-14, 08:15 is the Oklab midpoint of Manganês and Cobalto (`bg` `#ededf3`).
  - E4 THEME-12, the crossings: the ground moves every minute, the inks switch at 06:15 and 19:46,
    and the mode changes at those two minutes only.
  - E5 THEME-13, a test glaze with muted at 2:1 on a light ground is moved toward black only as far
    as 4.5:1; tokens above their minimum stay as the table has them.
  - E6 THEME-02, 02:00 is Vidrado nocturno with `edge` `#526c8c`, the one moved token.
  - E7 THEME-04 with THEME-P-08, every minute of the day, each pair at its minimum on the rounded hex:
    the eight inks against `bg` and `surface`, `onAccent` against `accent`, the footer's text and
    gold and the band's text against their grounds, the label against the gold; 19:48 and 19:52
    named.
  - E8 THEME-P-01, the guard taken out of the engine: E7 goes red naming 02:00, `edge`, 2.96:1
    (a break, restored, md5 checked).
- **The tokens** (`scripts/glaze-tokens.test.mjs`):
  - S1 THEME-16, `styles.css`'s `:root` colour block is the engine at 12:30 and its `html.dark-theme`
    block the engine at 02:00, through the map, with the gold pair (D13); outside the blocks no
    `--zc-*` holds a colour literal except the shadows. Red today: the dark edge, the five hand-made
    tokens, no markers.
  - S2 THEME-P-07 at the generator: with a bad table it fails naming the glaze and token, and
    `styles.css` keeps its bytes.
  - S3 Running the generator twice gives the same bytes as once.
  - S4 THEME-P-06, the dark `--zc-edge` set back to `#516b8b` by hand: S1 goes red naming the token,
    the value and `#526c8c` (a break, restored, md5 checked).
- **After the slice:** the unit suite, `npm run test:scripts`, the build and `npm run acceptance`
  green; `docs/design.md`'s trap about the night edge and `CLAUDE.md`'s "Styling" updated.

Not in slice 1: the head script and `ThemeService` on the engine, the tick and its transition
(slice 3); Material (slice 2); the old hero's local colours (slice 4); any browser check (slice 5).

### Diagram: the engine and the generator

```mermaid
flowchart LR
    T["glaze.json<br/>5 glazes × 14 tokens, keyframes,<br/>minimums, map, gold pair"] --> C{"checkTable (T2, S2)"}
    C -->|"a token missing or not in the map"| X["refused: glaze and token named,<br/>styles.css keeps its bytes"]
    C -->|"ok"| E["themeAt(table, minute)"]
    M["the minute, injected<br/>750 = 12:30, 120 = 02:00"] --> E
    E --> K["keyframe pair, smoothstep t<br/>08:15: Manganês → Cobalto, t = ½ (E3)"]
    K --> B["surfaces blended in Oklab<br/>bg #ededf3 at 08:15"]
    K --> S{"crossing?<br/>06:00–06:30, 19:30–20:00"}
    S -->|"yes"| I["inks snap to the ground's side<br/>dark to 06:14, light from 06:15;<br/>light to 19:45, dark from 19:46 (E4)"]
    S -->|"no"| J["inks blended too"]
    B --> G["guard on the rounded hex (D2)<br/>edge #516b8b 2.96:1 → #526c8c 3.00:1 (E5, E6)"]
    I --> G
    J --> G
    G --> D["footer and band by mode, guarded (D5)<br/>gold #d9a94a falls to 2.21:1 at 06:14 unguarded"]
    D --> H["hex + mode"]
    H -->|"every minute"| R["E7: each pair at its minimum"]
    H -->|"12:30 → :root, 02:00 → html.dark-theme"| W["glaze-tokens.mjs writes<br/>styles.css's two blocks (S1, S3)"]
```

### Session type

The engine itself is a pure calculation: no protocol. The generator has an order: the table is
checked before anything is computed, and only the generator writes the blocks. Convention: a role
that a branch never calls just ends there.

```
G = Gen → Engine : check(table) .
    Engine → Gen : { ok .
                       Gen → Engine : themeAt(750) . Engine → Gen : glaze(hex_light, light) .
                       Gen → Engine : themeAt(120) . Engine → Gen : glaze(hex_dark, dark) .
                       Gen → Styles : write(root = hex_light ∪ gold, dark = hex_dark) .
                       Test → Styles : read .
                       Styles → Test : { same . end , drift(token, have, want) . end } ,
                     refused(glaze, token) . Gen → CI : fail(glaze, token) . end }

Gen ↾    = Engine!check . Engine?{ ok . Engine!themeAt . Engine?glaze . Engine!themeAt . Engine?glaze .
                                        Styles!write . end ,
                                   refused . CI!fail . end }
Engine ↾ = Gen?check . Gen!{ ok . Gen?themeAt . Gen!glaze . Gen?themeAt . Gen!glaze . end , refused . end }
Styles ↾ = Gen?write . Test?read . Test!{ same . end , drift . end }
```

| Arrow in the diagram | Step in G | Rows |
|---|---|---|
| glaze.json → checkTable | `check(table)`, `{ok, refused}` | T1 (the table itself), T2, S2 |
| checkTable → refused | `refused(glaze, token) . fail` | T2, S2 |
| minute → themeAt → keyframes → blend, crossing, guard → hex | `themeAt(m)`, `glaze(hex, mode)` | E1–E7 |
| hex at 12:30 and 02:00 → styles.css | `themeAt(750)`, `themeAt(120)`, `write(…)` | S1, S3 |
| (the test reads styles.css) | `read`, `{same, drift}` | S1, S4 |

Forbidden by G, each refused and the stored state checked unchanged:
- **a write after `refused`:** S2 (`styles.css`'s md5 before and after).
- **a write not by `Gen`** (a hand edit of a generated line): `drift(edge, #516b8b, #526c8c)`, S4.
- **a repeat of the one-shot `write`:** allowed, and must change nothing: S3.
- **a guard step left out** (`glaze` with a token below its minimum): E8 (THEME-P-01).
- Stale tokens and races: none; one process, nothing shared.

**Done 2026-11-15** (the plan, then T1 to S3, one commit each). Red first, each for its own reason:
T1 an empty table against the mock-up's (a first red came from the test itself, a TypeError on
`{}`; the mock-up writes the gold as `--foot-gold` and the label in `.foot__mail`); T2 "Missing
expected exception"; E1 `undefined` for every token; E3 `#f0ebf2` for `#ededf3`; E4 the inks blending
through grey and the mode from the earlier keyframe; E5 `moved []`, muted left near 2:1; E7 the
footer's and band's pairs missing; S1 no blocks and 44 hand-typed colour lines (the dark edge, the
five tokens; a second red from the test's own selector, which caught the comments above `:root`).
Green at first and shown to bite, each break restored (md5 checked): E2 (the lookup's `>=` made `>`),
E6 (the guard's loop emptied: edge `#516b8b`), THEME-P-08 (the guard judging the unrounded colour:
19:48's body red, and THEME-04 with 115 pairs a hair under), S2 (the generator emptying `styles.css`
before rendering), S3 (the block inserted, not replaced). Protocol and break rows: THEME-P-01 (the
guard taken out: THEME-04 red naming the night minutes, `edge on surface`, 2.96), THEME-P-06 (the dark
`--zc-edge` set back to `#516b8b`: THEME-16 red naming `--zc-edge`, `#516b8b`, `#526c8c`; restored by
`npm run glaze`, md5 checked), THEME-P-07 (T2, S2). The gold's guard, taken out once, gave THEME-04
the case's figures: 12 minutes under 4.5:1, 2.21:1 at 06:14 and 19:46.

Found on the way: on the rounded ground the morning switch fell at 06:16; the study judges the side
on the unrounded ground, which gives the agreed 06:15, so the engine does that (D2 is about the
minimums, not the mode).

Results: scripts 32/32 (the engine's 10, the generator's 3); unit 281 passed, 5 skipped (47 files);
the build prerenders 26 routes (the 508 kB budget warning as before); `acceptance` 138/138; the built
stylesheet holds `--zc-edge: #526c8c` and none of the five removed tokens. Not run: the browser tests
(no rendering change but the night edge's one step; slice 5 measures every glaze) and
`acceptance:nginx` (no server change). The load stayed high most of the slice (up to 20 on 8 cores);
each heavy run waited for it, and none failed.

Leftovers, not built:
- **The engine is not used at runtime yet:** the head script and `ThemeService` take it in slice 3,
  which also sets the guarded footer gold and text at the crossings (today the page has only the two
  fixed states, where the gold is unmoved).
- **The other four mock-ups** hold the same engine; THEME-15 compares the table with the home
  mock-up's only. A check across all five is cheap if they are ever edited.

## Slice 2: Material follows the glaze (B1, B2, B3)

What it builds: `material-theme.scss` keeps Material's type and density and loses its palettes;
every `--mat-sys-*` colour becomes a `var(--zc-…)` by D9's map, through `mat.theme-overrides`
(Material 21 writes no colour of its own when `mat.theme` has no `color`). The page ground stops
coming from `--mat-sys-surface` (B2). The dead `--mdc-*` overrides go (B3): the header's "write to
me" button is a plain filled button again, which now takes `--zc-accent` and `--zc-on-accent` as
the home mock-up's `.btn--fill`; the header's icon buttons draw in the bar's ink `--nav-fg` (the
mock-up's `.icon-btn`), through Material's live hook `--mat-icon-button-icon-color`. Nothing at
runtime changes the glaze yet (slice 3), so the browser tests write the engine's tokens for 06:30,
19:00 and 20:00 on `<html>` themselves (with `dark-theme` by the glaze's mode): what slice 2 claims
is that Material follows whatever tokens the page has.

Measured on the build of `42b1516` (2026-11-20, before the slice; a scratch probe, not a test):
- the header's filled button `#006a6a` with a `#ffffff` label in light, `#00dddd` with `#003737`
  in dark; the theme toggle's glyph `#556476` (muted, `theme-toggle.css`), not the bar's ink;
- at 390, `mat-sidenav-container` is Material's `#f7faf9` in light and `#101414` in dark (the
  glaze's ground is `#e9eff4` and `#0b1526`); `body` is already the glaze's (`styles.css` comes
  after `material-theme.scss`), and `mat-sidenav-content` is transparent;
- every `--mdc-` in the build is ours: the header's (desktop and phone) and the old hero's.

Test list (crossed off in the "Done" note below as each is committed):
- **In the browser** (`acceptance/browser/theme-material.test.mjs`, on the built site):
  - B1 THEME-11, `/en/software`: at 1280 the header's filled button is `--zc-accent` with a
    `--zc-on-accent` label and the theme toggle's glyph is `--nav-fg`; at 390 the theme toggle's
    and the menu button's glyphs are `--nav-fg`. In light, dark, and the engine's glaze at 06:30,
    19:00, 20:00 set on `<html>`. Each colour compared with the token resolved on the same page.
    Red today: the teal above.
  - G1 THEME-18, `/en/software` at 390 and 1280, the same five states: `body`,
    `mat-sidenav-container` and `mat-sidenav-content` are each `--zc-bg-warm` or transparent, and
    the first opaque ground behind `<main>` is `--zc-bg-warm`. Expected green once B1's map is in
    (`background` and `surface` → `--zc-bg-warm`), so shown to bite: the built stylesheet's
    `--mat-sys-surface` set back to `#f7faf9` once, red at 390, restored (md5 checked).
- **In the build** (`acceptance/theme.test.mjs`):
  - M1 THEME-17, the built stylesheet: every role of D9 is declared as its token, and no
    `--mat-sys-*` declaration holds a colour literal, apart from the shadows' black in
    `level0` to `level5` (D5). With it, in `scripts/material.test.mjs`: `material-theme.scss` names
    no `$…-palette`. Expected green once B1 is in; it bites in M2.
  - M2 THEME-P-05, `primary: mat.$cyan-palette` put back in `material-theme.scss` and built: M1
    red naming `--mat-sys-primary`; restored (md5 checked) and built again.
- **In the sources** (`scripts/material.test.mjs`, `npm run test:scripts`):
  - G2 THEME-18, `material-theme.scss`'s `body` takes no `--mat-sys-*` colour. Red today:
    `background-color: var(--mat-sys-surface)` and `color: var(--mat-sys-on-surface)`.
  - D1 THEME-19, no `--mdc-` in any `.css`, `.scss`, `.html` or `.ts` under `src/`, nor in the
    built site. Red: the header button's two and the old hero's four (the icon buttons' two go in
    B1, replaced by the live hook).
  - D2 THEME-P-04, `--mdc-filled-button-container-color` put back in `zc-nav-desktop.css`: D1 red
    naming the file and line; restored (md5 checked).
- **After the slice:** the unit suite, `npm run test:scripts`, the build, `npm run acceptance` and
  `npm run acceptance:browser` green; `docs/design.md`'s teal trap and `CLAUDE.md`'s "Material 3
  theme" lines say what is true now.

Not in slice 2: the glaze at runtime, the toggle's three states (slice 3); the old hero's colours,
whose dead `--mdc-` lines go here but whose fixed colours go in slice 4 (THEME-26); the header
button's type and corners as the mock-up (the header's own cases, below the slices); every glaze
measured on every page (slice 5).

### Diagram: where Material's colours come from

```mermaid
flowchart LR
    T["--zc-* on html<br/>styles.css (12:30, 02:00), or the engine's<br/>06:30, 19:00, 20:00 set by the test"] --> Y
    S["material-theme.scss<br/>type and density, no palette (M1, M2);<br/>theme-overrides: D9's map"] --> Y["--mat-sys-* = var(--zc-…)"]
    Y -->|"primary, on-primary<br/>today #006a6a on #ffffff"| B["filled button: --zc-accent,<br/>label --zc-on-accent (B1)"]
    Y -->|"surface, background<br/>today #f7faf9 at 390"| G["sidenav container and content:<br/>--zc-bg-warm (G1)"]
    N["--nav-fg, the header's CSS"] -->|"--mat-icon-button-icon-color<br/>today #556476 and on-surface-variant"| I["icon buttons: the bar's ink (B1)"]
    W["body in material-theme.scss<br/>--mat-sys-surface (G2)"] -.->|"removed"| G
    X["--mdc-* overrides,<br/>read by nothing"] -.->|"refused (D1, D2)"| R["THEME-19 red, file and line"]
    P["a palette put back"] -.->|"refused (M2)"| R2["THEME-17 red, --mat-sys-primary"]
```

### Session type

The interaction is the page's paint: the build compiles Material's theme, the page sets the
glaze's tokens, Material's components ask for a role and get a token's colour, and the test reads
what was painted. Convention: a role that a branch never calls just ends there.

```
G = Build → Theme : compile .
    Theme → Build : { mapped .
                        Glaze → Html : tokens(hex, mode) .
                        Test → Page : open(route, width) .
                        Page → Material : style(element) .
                        Material → Html : read(--mat-sys-role = var(--zc-token)) .
                        Html → Material : colour(hex) .
                        Material → Test : { glaze(element, hex) . end ,
                                            foreign(element, hex) . end } ,
                      palette(name) . Build → CI : fail(--mat-sys-primary) . end }

Test ↾     = Page!open . Material?{ glaze . end , foreign . end }
Material ↾ = Page?style . Html!read . Html?colour . Test!{ glaze . end , foreign . end }
Theme ↾    = Build?compile . Build!{ mapped . end , palette . end }
```

| Arrow in the diagram | Step in G | Rows |
|---|---|---|
| material-theme.scss → `--mat-sys-*` | `compile`, `{mapped, palette}` | M1, M2 |
| a palette put back → THEME-17 red | `palette(name) . fail(--mat-sys-primary)` | M2 |
| `--zc-*` on html → `--mat-sys-*` | `tokens(hex, mode)`, `read(…)`, `colour(hex)` | B1, G1 (five states each) |
| `--mat-sys-*` → filled button | `style(button)`, `{glaze, foreign}` | B1 |
| `--nav-fg` → icon buttons | `style(icon button)`, `{glaze, foreign}` | B1 |
| `--mat-sys-*` → sidenav ground; body's `--mat-sys-surface` removed | `style(sidenav)`, `{glaze, foreign}` | G1, G2 |
| `--mdc-*` → refused | (a `style` hook no role reads: not in G) | D1, D2 |

Forbidden by G, each refused and the stored state checked unchanged:
- **a colour from a palette** (a `--mat-sys-*` not read from a `--zc-*`): M2, the scss's md5
  restored and the build redone.
- **a message to a role that never receives it** (an `--mdc-*` hook, which Material 21 no longer
  reads): D1, D2, the file's md5 restored.
- **a ground painted before the glaze's** (`--mat-sys-surface` on a layer above `body`): G1's
  break, the built stylesheet's md5 restored.
- **a stale colour** (Material holding a value from before the tokens changed): B1 and G1 set the
  tokens after load, at three more glazes, and read again.
- Races: none; the paint has one writer per state.
