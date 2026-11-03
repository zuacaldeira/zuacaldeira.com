# CLAUDE.md — zuacaldeira.com

This is a personal website for Zua Caldeira, built with Angular 21 and deployed to a VPS.

The Angular app lives in `frontend/`; the Spring Boot content API in `backend/` (see `docs/tdd.md`).
The build takes its text from that API (see "Build & Dev Commands").
Run the commands below in `frontend/`. Paths in this file (`src/...`, `public/...`, `dist/...`)
are relative to `frontend/`.

## Build & Dev Commands

```bash
npm run content    # Content snapshot from the build's backend (needed before start/build)
npm start          # Dev server at http://localhost:4200
npm run build      # Production build (prerendered SSR output)
npm test           # Run tests (Vitest)
npm run watch      # Dev build with file watching
npm run serve:ssr:zuacaldeira-com  # Serve SSR build locally
```

Build output: `dist/zuacaldeira-com/browser/` (prerendered static HTML).

**Content snapshot.** `npm run content` (`scripts/fetch-content.mjs`) asks the content API for
every page, section and language and writes `src/app/content/content.generated.json`
(git-ignored), which `app.config.ts` provides as `CONTENT`. Without it the build fails. The API
is the build's own backend, from the repo root: `docker compose -f compose.build.yml up --build
--wait` (MySQL and the API on `127.0.0.1:8081`, seeded from `backend/src/main/resources/db/seed`),
and `docker compose -f compose.build.yml down -v` after the build. `CONTENT_API` overrides the
URL. Specs never read the file: they use `provideTestContent()` from `content/content.testing.ts`.

## Architecture

- **Angular 21** with SSR prerendering (`@angular/ssr`), no runtime server — all routes prerendered to static HTML
- **Standalone components** throughout (no NgModules)
- **Lazy-loaded routes** via `loadComponent()` in `app.routes.ts`
- **Content:** the home hero comes from the content API through the build's snapshot; the rest
  still lives in `ContentService` and the i18n files

### Folder Layout

```
src/app/
  common/           # Shared UI: navigation/, footer/, theme-toggle/, section-header/
  pages/            # Route components: home/, about/, research/, work/, paedagogik/, running/, contact/
  services/         # ThemeService, ContentService, I18nService
  models/           # TypeScript interfaces (including i18n.ts)
  i18n/             # Translation files: en.ts, pt.ts, de.ts, fr.ts
```

## Routing

Routes defined in `src/app/app.routes.ts`. All lazy-loaded:
- `/` redirects to `/home`
- `/home`, `/about`, `/research`, `/running`, `/contact`

`/work` and `/paedagogik` are **hidden** — their page components still live in `pages/work/` and
`pages/paedagogik/` (with tests), but the routes and the `ContentService.navItems` entries are
removed until the content is fine-tuned. Restore both to bring the pages back.

Server routes in `src/app/app.routes.server.ts` use `RenderMode.Prerender` for all paths (`**`).

## Key Services

**ThemeService** (`services/theme.service.ts`)
- Signal-based dark mode toggle
- SSR-safe with `isPlatformBrowser` guard
- Persists preference to `localStorage`
- Toggles `.dark-theme` class on `<html>`

**ContentService** (`services/content.service.ts`)
- Static data provider — typed readonly arrays, no HTTP calls
- All site content (projects, experiences, etc.) defined inline

**I18nService** (`services/i18n.service.ts`)
- Signal-based language switching (`language` signal + computed `translations`)
- SSR-safe, persists to `localStorage`, auto-detects browser language

## Component Patterns

**ZcPage** (`common/navigation/zc-page/zc-page.ts`)
- Responsive layout wrapper used by all page components
- Uses `BreakpointObserver` to switch between `ZcNavMobile` and `ZcNavDesktop`

**General conventions:**
- All components are standalone (no NgModules)
- Component styles use plain CSS (`.css` files)
- SCSS is only used for the Material theme (`src/material-theme.scss`)

## Styling

**Design tokens** — CSS custom properties prefixed `--zc-*` defined in `src/styles.css`:
- Colors: `--zc-text-heading`, `--zc-bg-warm`, `--zc-accent`, etc.
- Spacing: `--zc-space-2` through `--zc-space-24`
- Typography: Inter font family (`--zc-font-heading`, `--zc-font-body`)

**Material 3 theme** — `src/material-theme.scss`:
- Primary: `mat.$cyan-palette`
- Tertiary: `mat.$violet-palette`
- Typography: Inter
- Dark theme via `.dark-theme` class on `<html>`

## Internationalization (i18n)

**I18nService** (`services/i18n.service.ts`)
- Signal-based language switching with computed `translations` signal
- SSR-safe with `isPlatformBrowser` guard
- Persists preference to `localStorage` (`zc-lang` key)
- Auto-detects browser language on first visit
- `language` signal holds current `Language`, `translations` signal holds current `Translations` object

**Type-safe translations** via the `Translations` interface in `models/i18n.ts`
- Supported languages: `'en' | 'pt' | 'de' | 'fr'` (English and Portuguese implemented, German and French fall back to English)
- Translation files live in `src/app/i18n/` — one file per language exporting a `Translations` object
- Covers all sections: nav, hero, about, research, work, paedagogik, running, contact, footer, common labels
- Content arrays (`projects`, `facharbeiten`) are also translated

## Testing

**Vitest** via `@angular/build:unit-test` — run with `npm test`.

- Test files use `*.spec.ts` convention, colocated with source files
- Vitest globals enabled (`describe`, `it`, `expect`, `vi` available without imports)
- `tsconfig.spec.json` extends base config with `vitest/globals` types
- CI runs the backend's and the frontend's tests before the build in `.github/workflows/build-site.yml`
- `npm run test:scripts` runs the build scripts' tests; `npm run acceptance` reads the built site

**Test patterns:**
- Services: use `TestBed.inject()` with `PLATFORM_ID` override for SSR tests
- Components with logic: use `TestBed.createComponent()` with `NO_ERRORS_SCHEMA` to skip template resolution of child components
- Components with router: add `provideRouter([])` to providers
- `window.matchMedia`: must be mocked in `beforeEach` (jsdom doesn't provide it)
- `localStorage`: leaks between test files — explicitly set language/theme in tests rather than assuming defaults
- Input components (`@Input`): set inputs before `detectChanges()`

**Coverage:** 28 test files, 165 tests (2026-11-03) covering App component, all 3 services, all 22 components, and app routes.

## TypeScript

Strict mode with all extra checks enabled (`tsconfig.json`):
- `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Angular: `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`
- Target: ES2022, TypeScript ~5.9

## Formatting

Prettier config is in `package.json`:
- `printWidth: 100`
- `singleQuote: true`
- HTML files use `angular` parser

## Deployment

- **One build for both sites:** `.github/workflows/build-site.yml` (a reusable workflow) runs the
  backend's tests (`./mvnw verify`), the frontend's (`npm test`, `npm run test:scripts`), starts
  `compose.build.yml`, takes the snapshot (`npm run content`), builds with
  `ng build --configuration production`, removes `CNAME`, copies the prerendered 404 page
  (`404/index.html`) to `404.html` for nginx (HOME-PAGE-06), writes the preview's `robots.txt` when
  asked, runs `npm run acceptance` and `npm run acceptance:nginx` (the web image's nginx config in
  Docker, on the prepared site), and uploads the site as the artifact `site`
- **Live site:** `.github/workflows/deploy.yml` triggers on push to `main` (or `workflow_dispatch`),
  calls the build, then rsyncs the `site` artifact (with `--delete`) over SSH to the VPS at
  `/var/www/zuacaldeira.com/` as user `deploy-zuacaldeira`
- Secrets: `DEPLOY_SSH_KEY`, `DEPLOY_HOST`
- Finishes with a `curl` check that `https://zuacaldeira.com` responds
- `public/CNAME` is a leftover from GitHub Pages; the rsync excludes it
- The live nginx site is kept in `infra/live/nginx-site.conf` (installed by hand as
  `/etc/nginx/sites-available/zuacaldeira.com`; all `add_header` at server level)
- **Preview site:** on push to `next`, `.github/workflows/deploy-next.yml` calls the build with
  `preview: true` (`robots.txt` with `Disallow: /`), packs the artifact into the web image
  (`frontend/Dockerfile`, nginx only), pushes it to
  `ghcr.io/zuacaldeira/zuacaldeira.com-web`, and has the VPS pull and restart it on `127.0.0.1:3130`
  behind the host nginx (https://next.zuacaldeira.com). Server files in `infra/next/`, setup and
  rollback in `docs/deploy-next.md`. Merge `next` into `main` to ship.
- Node 22 in CI
