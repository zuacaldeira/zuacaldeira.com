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
- **Direction: azulejo and lattice** (settled 2026-07-17). The Hasse diagram of the
  author's theorem and a Lisbon tile panel are the same drawing. The blue is Lisbon tile
  cobalt and also Casa Azul. Do not bring back the generic look it replaced: Inter, a cyan
  accent, Material cards everywhere, a blurred gradient-mesh hero.
- **Tokens:** the `--zc-*` custom properties in `frontend/src/styles.css`, light theme on
  `:root` and the night glaze on `html.dark-theme`. Every colour is contrast-checked
  against its background; the comment at the top of that file says how. Mock-ups copy
  these properties, never retyped hex.
  - Cobalt `--zc-azul` `#14417a` on glaze `--zc-bg-warm` `#e9eff4`, ink `#0b1526`.
  - Ochre `--zc-ochre` `#b07a22` is for graphics only (3.21:1). Ochre text uses
    `--zc-ochre-text` `#8a5e15`.
  - Lattice edges use `--zc-edge` (held at 3:1 or more), not the decorative grout.
- **Type:** Fraunces for display, Archivo for body text, IBM Plex Mono for notation, venue
  names and data. Loaded from Google Fonts in `frontend/src/index.html`.
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

- **Living glaze** (agreed 2026-11-02, as the study has it, unchanged):
  https://claude.ai/artifact/LGHSasJRc4DXdBmk95CGyD. Five azulejo glazes follow the visitor's
  local time: Manganês, Cobalto (today's light theme), Amarelo e verde, Manganês nocturno,
  Vidrado nocturno (today's night glaze). The study holds the values, the times, the fast
  light/dark crossing, the contrast guard and the reduced-motion rule. The toggle has three
  states: light, dark, living. Every new screen is checked under all five glazes.

- **Living is the default theme state** (agreed 2026-11-02); light and dark are manual overrides.
- **Theme settings** (agreed 2026-11-02): the hero and the theorem band are settings beside the
  glaze, `{ hero: 'b', band: 'c' }`. Only these defaults are built; the other options stay in
  the mock-up until first wanted. The frame is not a setting.
- **Website v2** (agreed 2026-11-02): the row of boards on the Visual Identity canvas,
  https://claude.ai/artifact/V4BY3xCveYFdkCky8kFXXa, gives the pages, sections, message and
  the 2³ lattice hero. Its cream and white grounds and its per-page Rota glaze do not
  apply: colours come from the living glaze.

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
- **Teal is a bug, not a decision.** `frontend/src/material-theme.scss` still sets the
  cyan and violet palettes and Inter, and the ochre button overrides in the components use
  `--mdc-*` variables that have no visible effect. Every Material button renders `#006a6a`
  (night `#00dddd`), on the live site too (measured 2026-11-02). Mock-ups use the intended
  ochre and gold, never the teal.
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
