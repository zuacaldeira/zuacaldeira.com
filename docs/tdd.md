# TDD profile: zuacaldeira.com

The project profile for the shared `tdd-peer` agent (`~/.claude/agents/tdd-peer.md`),
which reads this file at the start of every session. Where this file and the agent
differ, this file wins.

Every new session in this repo starts as `tdd-peer` in pair mode (`"agent": "tdd-peer"` in
`.claude/settings.json`, agreed 2026-10-28). For work that is not test-first (server setup,
design mock-ups), start a session with `claude --agent claude`. For both peers in one
session, start `claude --agent a-team`: it adds `ui-design-peer` and `tdd-peer` as teammates
(agent teams, experimental, enabled in `.claude/settings.json`) and routes the work. For batch mode, agree the
test list and diagram with the developer, then spawn the agent with "Mode: batch".

## Architecture (agreed 2026-10-28)
The new site gets a backend. Until the repo is restructured, `CLAUDE.md` still
describes the old frontend-only site.
- **Layout:** one repo with `frontend/` (the Angular app, moved from the root) and
  `backend/` (Spring Boot, Java 21, Maven wrapper). The frontend moved on
  2026-10-28; `backend/` does not exist yet.
- **Backend jobs:** serve the content (pages, papers, races and the rest, in EN/DE/PT),
  receive the contact form and send mail, an authenticated admin area to edit content
  and translations, and live data (e.g. Strava) fetched and cached on the server.
- **Database:** MySQL 8 with Flyway migrations.
- **Rendering:** pages stay prerendered. The Angular build fetches the content from the
  backend at build time. At runtime the browser calls the backend only for the contact
  form, the admin area and live data.

## Sources of truth
- `CLAUDE.md`: architecture, folder layout, build and deploy of the frontend. Parts are
  out of date: it says there is no backend; the fonts are Fraunces, Archivo and IBM Plex
  Mono (not Inter); and the test counts change with every feature.
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

## How the work is cut
Page by page, section by section (agreed 2026-10-28). One element is one section of one
page (e.g. the home hero, the research paper list). Finish a section in all three
languages, with its tests, before starting the next one. The examples file of a page
lists its sections in order.

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
**Backend** (`backend/`): Java 21, Spring Boot, MySQL 8, Flyway.
- **Java 21 comes from a Maven toolchain.** The machine default is Java 25, and on 25
  Mockito cannot mock our classes. Configure `maven-toolchains-plugin` to pick JDK 21
  from `~/.m2/toolchains.xml` (it exists), and check the build log says so.
- **Unit tests:** JUnit 5 and Mockito, for the domain core. Run
  `cd backend && ./mvnw test -Dtest=ClassName`; the whole unit suite with `./mvnw test`.
- **Integration:** Testcontainers against a real MySQL 8 (`*IntegrationTest`), for
  persistence, Flyway migrations and the content API. No in-memory database stand-ins.
  Per element, run only the touched classes with `-Dtest=...`; run the whole set once at
  the end of a section.
- **Example IDs:** backend tests cite the example they cover with
  `@DisplayName("HOME-HERO-05 …")`, the ID in the display name.
- **Role boundaries:** the admin area is a security boundary. Each admin endpoint gets a
  table of endpoint × role (anonymous, admin) and a security slice test per row. The
  public content endpoints are read-only for anonymous visitors.
- **Security side effects of refused requests** (failed login counts, lockouts, audit
  entries) must survive the exception that follows: `noRollbackFor` on the outermost
  transaction, or `REQUIRES_NEW` in a separate bean. Each gets a Testcontainers test that
  goes red without the protection (remove it once, see red, restore).
- **Contact form:** the mail sender is an adapter. Unit tests use a fake; one
  integration test uses a local SMTP container. Never send real mail from a test.
- **Live data:** the external API (e.g. Strava) is an adapter behind an interface. Tests
  never call the real service; record its responses as fixtures.

**Frontend:** Angular 21, standalone components, **zoneless** (no zone.js), prerendered at
build time. Vitest through `@angular/build:unit-test`, with globals. Run every frontend
command in `frontend/`.

- **One spec while iterating:** `npx ng test --no-watch --include='<path>'` (about 8 s).
- **Whole suite:** `npx ng test --no-watch` (about 14 s, 159 tests on 2026-10-28). Run
  it before every commit.
- **Prerender check:** `npm run build`, then read the HTML in
  `frontend/dist/zuacaldeira-com/browser/<route>/index.html`. This is the system-level test for
  routing, `lang` attributes and translated text in static output. It takes longer than
  the suite, and right after a suite run it has crashed once inside esbuild on this machine
  (a second run passed); run it at the end of an element that touches routes or prerendering, not
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
  The Testcontainers MySQL takes its share too: never run backend integration tests
  next to the frontend suite.
- One Maven process at a time in `backend/`; two runs corrupt `target/`.
- Testcontainers needs Docker (installed). If it cannot find the API version, set
  `DOCKER_API_VERSION=1.44`, as in the Kita Casa Azul project on this machine.

## Commits, branches and deploys
- **Branch:** work in progress goes on `next`. A push to `next` deploys the preview
  to https://next.zuacaldeira.com (`.github/workflows/deploy-next.yml`). `main` is the
  live site; a push to `main` deploys zuacaldeira.com. Merging `next` into `main` is the
  developer's call.
- **Commit messages:** one plain sentence in the imperative that names the behaviour,
  as in the existing `git log` (e.g. "Say whether the wall's counts are classes or
  protocols"). A short body explains why. End with the attribution lines given in the
  brief.
- **Record the red step** in the commit body of every element, one line each, so the git
  log alone gives a trace of the cycle:
  - `red: <test name> — <the failing assertion, one line>`
  - `green: <fake it | obvious | triangulated>`
  - and for a bug fix, `bites: reverted the fix, <test name> went red`.

  Example body lines:
  `red: shows the German tagline on /de/home — expected "Forscher. Entwickler. Erzieher. Läufer." but got ""`
  and `green: fake it`.
- **Do not push** unless the brief says so. Never push to `main`.
- **When to push, merge and deploy** (decided by the developer, 2026-10-29):
  - **Push `next` after every element,** once its commit passes the whole suite, the acceptance tests
    and, where the element touches routes, the prerender check. In pair mode the main session pushes and
    says so; an agent in batch mode pushes only when its brief says so.
  - **Merge `next` into `main` page by page:** when a page is done (all three languages, its examples
    covered, reviewed on the preview), the developer merges and the live site gets it. A merge takes all
    of `next`, so a page that is not done stays out of reach on `next` (no route or no navigation link,
    as `/work` and `/paedagogik`). Before the first merge, the live nginx config
    (`infra/live/nginx-site.conf`) is applied on the server, because the language routes need it.
  - **Bugs on the live site, until its pages come from `next`:** a hotfix branch from `main`, test-first,
    merged and deployed after the developer's OK, then `main` merged into `next` so the fix is not lost.
    For pages already merged, the fix goes on `next` and is merged at once.
  - **Experiment branches** of the tdd-lab (`monitor/<condition>-<n>`) are never pushed or merged. An
    element built in the experiment is built once more on `next`, in pair mode, after its runs are read.

## TDD baseline boundary
Commit `c963461` (2026-10-28) is the last commit before test-first work with `tdd-peer`
in this repo. Everything up to it is the baseline: no type, no recorded red steps. From
the next element on, `tdd-peer` works to this profile; no session type is enforced. The
assessment monitor in `~/Development/projects/tdd-lab` is not built yet. When it is, it
can mine this repo's log from this boundary on.
- **Deploying:** the preview runs as a web container on the VPS (`docs/deploy-next.md`). The
  backend and MySQL join the same compose file later, bound to `127.0.0.1`; how is still the
  developer's decision.

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
