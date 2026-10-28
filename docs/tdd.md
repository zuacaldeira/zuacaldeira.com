# TDD profile: zuacaldeira.com

The project profile for the shared `tdd-peer` agent (`~/.claude/agents/tdd-peer.md`),
which reads this file at the start of every session. Where this file and the agent
differ, this file wins.

Sessions do not start as the agent by default. Use `claude --agent tdd-peer` for pair
mode. For batch mode, the main session agrees the test list and diagram with the
developer, then spawns the agent with "Mode: batch".

## Sources of truth
- `CLAUDE.md`: architecture, folder layout, build and deploy. Parts are out of date:
  the fonts are Fraunces, Archivo and IBM Plex Mono (not Inter), and the test counts
  change with every feature.
- `src/app/i18n/en.ts` and `ContentService`: the English text. It is the source for
  `de.ts` and `pt.ts`. Never invent content; ask.
- `src/styles.css`: the `--zc-*` design tokens, each contrast-checked against its
  background (the comment at the top of the file says how).
- `git log`: what was built and why.
- Rules the developer has settled (they hold unless the developer changes them):
  - **Languages.** English, German and Portuguese: `en`, `de`, `pt`. French is dropped.
    Each language has its own URL prefix (`/en/...`, `/de/...`, `/pt/...`), and every
    language's pages are prerendered. (Agreed 2026-10-28; reverses the English-only
    `TRANSLATIONS_ENABLED = false` of July 2026.)
  - **Notation is never translated.** Session types, `⊤`, `⊥`, `‖`, atom labels, venue
    names and paper abstracts stay as they are in every language.
  - **Notation must parse.** Every session type shown on the site is real grammar.
    Check each one with
    `python3 -m reticulatep.cli -f FILE` in
    `~/Development/research/SessionTypesResearch-ice2026/reticulateP` before it goes
    on a page. Change reticulateP itself only in its own programme, never from here.
  - **Design direction.** Azulejo and lattice: the M₄ Hasse diagram and the tile are the
    same drawing. Do not bring back the generic look (Inter, cyan, gradient mesh).
  - **Colours** come from the `--zc-*` tokens, never from hex literals in components.
    `--zc-ochre` is for graphics only; ochre text uses `--zc-ochre-text`.
  - **Hidden pages.** `/work` and `/paedagogik` stay out of the routes and the nav until
    the developer brings them back. Their components and tests stay.
  - **Scope.** This repo is the website only.

Open questions go to the developer. Do not write them into the code. Agreed answers go
in the feature's examples file under "Decisions", with the date.

## Where examples and diagrams live
- **New features:** examples with IDs and their diagrams go in
  `docs/examples/<feature>.md` (create the file on first use). Prefixes so far:
  `I18N-nn` for the trilingual site, `THEME-nn` for the living-glaze theme mode.
- **Bug fixes:** the reproducing case is the example. Give it an ID in the test list
  (e.g. `BUG-I18N-01`) and name it in the test. Its diagram goes in
  `docs/examples/<area>.md`.
- **Cross-cutting flows** (routing and prerender, deploy topology):
  `docs/architecture/`.

## Test stack and commands
Angular 21, standalone components, **zoneless** (no zone.js), SSR prerender only (no
runtime server). Vitest through `@angular/build:unit-test`, with globals.

- **One spec while iterating:** `npx ng test --no-watch --include='<path>'` (about 8 s).
- **Whole suite:** `npx ng test --no-watch` (about 14 s, 159 tests on 2026-10-28). Run
  it before every commit.
- **Prerender check:** `npm run build`, then read the HTML in
  `dist/zuacaldeira-com/browser/<route>/index.html`. This is the system-level test for
  routing, `lang` attributes and translated text in static output. It takes longer than
  the suite; run it at the end of an element that touches routes or prerendering, not
  after every step.
- **No end-to-end tool yet.** Adding one (e.g. Playwright) is a new dependency, so the
  developer decides.

Patterns that already hold in the specs (see `CLAUDE.md`, "Testing"):
- Services: `TestBed.inject()`, with a `PLATFORM_ID` override for the server side.
- Components with child components: `NO_ERRORS_SCHEMA`. With the router: `provideRouter([])`.
- `window.matchMedia` must be mocked in `beforeEach`; jsdom lacks it.
- `localStorage` leaks between spec files. Set language and theme explicitly in each test.
- Zoneless: after an async step, use signals or `fixture.whenStable()`, then assert on the
  rendered DOM, not only on a component field.
- No real clock in unit tests. Inject time (this matters for the living-glaze theme,
  which follows the time of day).

## Machine limits
- About 6 GB RAM, 8 cores. Never run two suites, or a suite and `npm run build`, at once.

## Commits, branches and deploys
- **Branch:** work in progress goes on `next`. A push to `next` deploys the preview
  to https://next.zuacaldeira.com (`.github/workflows/deploy-next.yml`). `main` is the
  live site; a push to `main` deploys zuacaldeira.com. Merging `next` into `main` is the
  developer's call.
- **Commit messages:** one plain sentence in the imperative that names the behaviour,
  as in the existing `git log` (e.g. "Say whether the wall's counts are classes or
  protocols"). A short body explains why. End with the attribution lines given in the
  brief.
- **Do not push** unless the brief says so. Never push to `main`.

## Time logging
None for this project.

## Quality rules beyond the agent's
- **Translation parity.** Every user-visible string goes through the `Translations`
  interface, and `en`, `de` and `pt` fill every key with a non-empty value. When the
  i18n work adds a parity spec, keep it green and extend it with new keys.
- **Accessibility.** Text meets 4.5:1, graphics and lattice edges 3:1 (WCAG 1.4.3 and
  1.4.11). Links are underlined. Motion respects `prefers-reduced-motion`. Each page
  sets `<html lang>` to its language.
- **Formatting:** Prettier settings in `package.json` (width 100, single quotes).
- **TypeScript strict** with Angular strict templates. No `any` to get a test green.
- **Coverage:** not measured in this project. Name the behaviours a feature's tests
  cover in its examples file instead.
- **Pure visual styling** (palettes, spacing, type) is reviewed visually against the
  design direction, not test-first.
