# Design profile: zuacaldeira.com

The project profile for the shared `ui-design-peer` agent (`~/.claude/agents/ui-design-peer.md`),
which reads this file before its first step. Where this file and the agent differ, this
file wins.

Status: **agreed with the developer on 2026-11-02.** Written 2026-10-28, corrected against
the rendered site on 2026-11-02. Questions still open are listed at the end of "The users".

New sessions in this repo start as `tdd-peer` (`.claude/settings.json`). For design work,
start a session with `claude --agent ui-design-peer`, or let the main session spawn it
with "Mode: mock-up", "Mode: review" or "Mode: batch". `claude --agent a-team` starts a
session with both peers as teammates.

## The site
The personal website of Alexandre Zua Caldeira: research (session types, the ICE 2026
lattice paper), software, pedagogy (training as an Erzieher in Berlin) and running. A
redesign is in progress on the `next` branch, previewed at https://next.zuacaldeira.com:
three languages (EN, DE, PT), content served by a Spring Boot backend and prerendered at
build time. See `docs/tdd.md` for the architecture.

## The users (agreed 2026-11-02)
The repo has no analytics, so this list is the developer's decision, not a measurement.
The boards name the same groups, plus the third.
- **Hiring managers, tech leads and recruiters** reading a CV link. They skim on a phone or
  laptop for a minute and ask: can he ship, in what stack, where is the CV? English or German.
- **Researchers and reviewers** in concurrency and type theory (ICE, POPL audience). They
  come from a paper or a talk, read on a laptop, and judge the notation. English.
- **Teams building AI agents.** They ask whether he can make their agents safe, and look
  for the case studies and the contact.

**Software leads the home page,** and the research is the proof that the engineering is
sound. A researcher still reaches the theorem and the paper without hunting.

No one signs in on the public site. The admin area (content and translations) comes later
and gets its own section here when it exists.

Open, for the developer:
- **Portuguese** stays a site language (decided 2026-10-28), but the Portuguese-speaking
  audience was not confirmed as a target. Keep the language anyway?
- **Runners and Berlin education colleagues** were not confirmed either, so screens are
  not designed around them. The running page stays.

## Settled: do not propose replacing these

### The reference for colour and theme (Zua, 2026-11-15)
"First make the Living glaze design the reference … If it's correct let's delete all other
sources that are provoking the drift." Decided after comparing the built site with the
mock-ups. The cases and slices are in `docs/examples/theme.md`.

- **The reference is the Living Glaze study,** https://claude.ai/artifact/LGHSasJRc4DXdBmk95CGyD.
  Its values are copied, identical, in the glaze engine of every agreed mock-up
  (`docs/mockups/{home,software,research,writing,about}/*.html`, checked 2026-11-15).
  - **Five glazes by the visitor's local time,** each with the same 14 colour tokens (background,
    surface, raised, wash, border; heading, body, muted; accent, accent hover, on accent; ochre,
    ochre text; edge): Manganês from 06:30; Cobalto 10:00 to 15:00 (today's light theme); Amarelo
    e verde until 19:30; Manganês nocturno at 20:00; Vidrado nocturno from 23:00 to 05:00 (today's
    dark theme). Between two keyframes the colours blend.
  - **Two crossings,** 06:00 to 06:30 and 19:30 to 20:00: the ground crosses between dark and
    light in about 30 minutes; the inks snap once, where both sides give equal contrast.
  - **The tokens are set once a minute,** with a short transition.
  - **The contrast guard:** text at least 4.5:1, lattice edges and ochre at least 3:1, against
    the background and the surface; the label on the accent at least 4.5:1. A token below its
    minimum is pushed toward black or white until it passes.
  - **A three-state toggle,** light, dark and living; **living is the default.** Light is
    Cobalto, dark is Vidrado nocturno, whatever the time.
  - **Reduced motion** keeps the glaze the page loaded with until the next load.
  - **Material follows the glaze:** its `--mat-sys-*` colours are the glaze's tokens, so
    buttons, toolbars and backgrounds take the current glaze.
- **The `--zc-*` colour tokens in `styles.css` come from the glaze,** never typed by hand.
- **Beside it, not colour:** this file (type, notation, contrast, languages, anatomy) and the
  agreed mock-ups' layouts.
- **Sources of drift, to go** (agreed 2026-11-15): Material's cyan and violet palettes in
  `material-theme.scss` (B1); the page ground from `--mat-sys-surface` (B2); the dead `--mdc-*`
  overrides (B3); light and dark only, from the device setting, in `theme.service.ts` (B4); the
  old photo hero with the lattice wall and its fixed colours (B5, replaced by D10 and D11 in
  `docs/examples/home.md`). The Visual Identity canvas stays for pages and message, no longer as
  a colour source.

### Also settled
- **Direction: azulejo and lattice** (settled 2026-07-17). The Hasse diagram of the
  author's theorem and a Lisbon tile panel are the same drawing. The blue is Lisbon tile
  cobalt and also Casa Azul. Do not bring back the generic look it replaced: Inter, a cyan
  accent, Material cards everywhere, a blurred gradient-mesh hero.
- **Tokens:** the `--zc-*` custom properties in `frontend/src/styles.css`, light theme on
  `:root` and the night glaze on `html.dark-theme`. Their colours come from the glaze (the
  reference above): Cobalto and Vidrado nocturno as the guard leaves them. Mock-ups copy
  these properties, never retyped hex.
  - Cobalt `--zc-azul` `#14417a` on glaze `--zc-bg-warm` `#e9eff4`, ink `#0b1526`.
  - Ochre `--zc-ochre` `#b07a22` is for graphics only (3.21:1). Ochre text uses
    `--zc-ochre-text` `#8a5e15`.
  - Lattice edges use `--zc-edge` (held at 3:1 or more), not the decorative grout.
- **Type:** Fraunces for display, Archivo for body text, IBM Plex Mono for notation, venue
  names and data. Loaded from Google Fonts in `frontend/src/index.html`.
- **Notation fonts** (agreed 2026-11-09): none of the three families holds the site's 12 symbols
  `₁ ₂ ℒ → ↗ ↠ ∥ ≅ ≡ ≤ ⊤ ⊥`, so devices drew them in whatever system font they had. Each font
  token is now its main family → Noto Sans Math → STIX Two Text, both from Google Fonts and
  loaded only for those symbols (`&text=`). Noto Sans Math draws ten of them; it lacks `₁ ₂`,
  which STIX Two Text draws (a serif, beside the Fraunces statements). Letters stay in Fraunces,
  Archivo and Plex Mono. Rejected: Noto Sans for the subscripts (sans beside Fraunces), and
  writing `s1`, `s2` with lowered digits (the text would no longer match the paper).
- **Material's type follows the site** (agreed 2026-11-10): `material-theme.scss` set Inter for
  every Material component, so the desktop menu, the "zc" mark, Material buttons (the band's PDF
  button) and the Running page's cards were drawn by Inter where a device had it, by its default
  sans elsewhere. Material's type settings now point at the site's families: Archivo for plain
  text, Fraunces for display. Found by SHELL-13's browser test (`docs/examples/shell.md`). As the
  home mock-up, the desktop menu is IBM Plex Mono and the "zc" mark Fraunces at weight 600, both
  written in the header's own CSS (approved 2026-11-10, `docs/design-reviews/2026-11-10-material-type.md`).
- **Hero:** the Website v2 hero: the sentence "I build software, and prove its protocols
  hold." with the 2³ lattice of `Zua = software ∥ research ∥ running`. It replaces the
  photographic hero, follows the glaze, and has no fixed colours. It sits on the study's
  lozenge tile pattern (hero option B). The header stays sticky.
- **Notation is never translated, and it must parse.** Session types, `⊤`, `⊥`, `‖`, atom
  labels, venue names, paper titles and the statements quoted from the paper stay as they
  are in every language. Every session type shown on a page is checked with reticulateP
  first (`python3 -m reticulatep.cli -f FILE` in
  `~/Development/research/SessionTypesResearch-ice2026/reticulateP`). Write equation
  programs (`Name = &{label: Next}`), never ad-hoc dot chains.
- **Hidden pages:** `/work` and `/paedagogik` stay out of the navigation until the
  developer brings them back.

- **Living glaze** (agreed 2026-11-02, as the study has it, unchanged; the colour reference since
  2026-11-15, above). Every new screen is checked under all five glazes.

- **Living is the default theme state** (agreed 2026-11-02); light and dark are manual overrides.
- **Theme settings** (agreed 2026-11-02): the hero and the theorem band are settings beside the
  glaze, `{ hero: 'b', band: 'c' }`. Only these defaults are built; the other options stay in
  the mock-up until first wanted. The frame is not a setting.
- **Website v2** (agreed 2026-11-02): the row of boards on the Visual Identity canvas,
  https://claude.ai/artifact/V4BY3xCveYFdkCky8kFXXa, gives the pages, sections, message and
  the 2³ lattice hero. It is not a colour source (2026-11-15): its cream and white grounds
  and its per-page Rota glaze do not apply; colours come only from the living glaze.

Not yet agreed:
- **Reacting to events** (a new post, a social event): wanted, not designed.

## Rules every screen follows
- **Three languages:** EN, DE and PT, at `/en/...`, `/de/...` and `/pt/...`, each with
  `<html lang>` set. Check every screen in English and at least in German, which runs
  longest. A raw translation key or English text on a German or Portuguese page is a
  broken finding.
- **Contrast:** text 4.5:1, large text and graphics (lattice edges, ochre marks) 3:1, in
  the light theme and in the night glaze.
- **Links in running text are underlined.** Colour is never the only cue.
- **Motion respects `prefers-reduced-motion`.**
- **No horizontal scroll** at 390 px.
- **Running text stays near 65 characters** wide (`.prose`, `max-width: 65ch`).

## Page anatomy
Every page: sticky header, `<main>` with the page's sections, footer. Header and footer are
the shared shell (`docs/examples/shell.md`). All of them share one column, 1200 px wide, and
the language codes sit in the header at every width (frame option A, agreed 2026-11-02). Spec:
`docs/mockups/home/home-spec.md`.

## Known traps
- **Material has no colours of its own** (since 2026-11-20, slice 2 of `docs/examples/theme.md`).
  `frontend/src/material-theme.scss` sets Material's type and density only; every `--mat-sys-*`
  colour is a `--zc-*` token by D9's map (the scrim by D14, the elevation from `--zc-shadow-*` by
  D15), so buttons, sidenav and toolbars follow the glaze. To restyle a Material component, set
  its live `--mat-<component>-*` token to a `--zc-*` token; `--mdc-*` variables are read by
  nothing in Material 21 (THEME-19 fails on one), and a palette put back fails THEME-17. Before
  this, every Material button rendered teal `#006a6a` (night `#00dddd`); the live site still does
  until `next` is merged.
- **The colour tokens are generated.** `styles.css`'s two colour blocks are written by
  `npm run glaze` from `frontend/src/app/services/glaze.json` (the study's table) through the
  site's engine `glaze.mjs`; a hand edit fails THEME-16. Change a colour in the table, which must
  stay equal to the mock-ups' engine (THEME-15). Since 2026-11-15 the night edge is the guard's
  `#526c8c` (3.00:1), no longer the hand-typed `#516b8b` (2.96:1), and `--zc-azul-pale`,
  `--zc-accent-light`, `--zc-ochre-wash`, `--zc-tile` and `--zc-grout` are gone.
- The layout wrapper `ZcPage` switches between mobile and desktop navigation with the
  CDK `Breakpoints.Handset` query, not a CSS width. Check both sides of it.
- The lattice wall is generated (`frontend/scripts/lattice-wall/render.py`); do not
  hand-edit `lattice-wall.html`.
- A German or Portuguese page whose hero shows English text may be a missing translation
  in the backend, not a layout bug. Since D4 in `docs/examples/home.md`, such a build
  fails instead.

## Where to look
- **Local:** `npm start` in `frontend/`, then http://localhost:4200/en/home (also `/de/`,
  `/pt/`).
- **Preview:** https://next.zuacaldeira.com/en/home (also `/de/`, `/pt/`).
- **Live:** https://zuacaldeira.com.
- **Widths:** 390 (phone), 768 (tablet), 1280 and 1440 (laptop). Light and dark theme.
- **No logins** on the public site.
- **Screenshots:** `node ~/design-library/tools/shot.cjs <url> <dir> <name> --full`, or a
  script requiring `playwright-core` from `~/design-library/tools/node_modules` for other
  widths and measurements. Playwright is not a dependency of this repo, and does not need
  to be for design work.

## Where results go
- **Mock-ups:** published as an artifact page for the developer to open and share, and
  kept in `docs/mockups/<feature>/` with the build spec `<feature>-spec.md`. The behaviour
  cases the spec implies go to `docs/examples/<feature>.md` with IDs, for `docs/tdd.md`.
- **Reviews:** `docs/design-reviews/<YYYY-MM-DD>-<scope>.md`, screenshots in
  `docs/design-reviews/<YYYY-MM-DD>-<scope>/`. Finding IDs are `UI-<AREA>-nn` (e.g.
  `UI-HOME-01`).
- **Previous reviews:** none in this repo yet. The design history is in `git log`
  (`bba05dd` the azulejo identity, `6eb664a` the photographic hero, `2921d47` the frosted
  header).

## Handover to tdd-peer
How a design becomes tested code. The agents do not start each other: the developer or
the main session carries the file from one to the other.

- **The full path** (mock-up, spec, examples file, review after the build) is for changes
  to what a page shows or does: a new page, a new section, a new state. Pure styling
  inside the settled design stays in pair or batch mode, with no mock-up.
- **The examples file is the one agreed list.** Mock-up mode ends with
  `docs/examples/<page>.md` in the format of `docs/examples/home.md`: a status line, case
  tables with IDs, diagrams, decisions. When the developer agrees it, that is also the
  agreement on tdd-peer's test list. Work goes page by page, section by section.
- **Open questions are answered before the build.** Do not build around them.
- **After the build,** review mode compares the rendered section on `next` with its
  mock-up and spec, at the agreed widths, in all three languages.

## Monitoring
`ui-design-peer` and `tdd-peer` are both meant to be observed by the assessment monitor
in `~/Development/projects/tdd-lab` (agreed 2026-10-28). The monitor is not built yet.
Commit messages of design work name the mode and step (e.g. "mock-up: present options
for the home hero"), so the git log can be mined until it exists.
